"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  markMessagesAsRead,
  type Conversation,
  type Message,
} from "@/lib/actions/chat"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Plus, Loader2, Building2, Clock, CheckCheck, ArrowLeft } from "lucide-react"

export function MessagesPage() {
  const { profil } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [newConvTitre, setNewConvTitre] = useState("")
  const [newConvMessage, setNewConvMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isAdmin = profil?.role === "admin"

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id)
    }
  }, [selectedConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function loadConversations() {
    setLoading(true)
    const { data } = await getConversations()
    setConversations(data || [])
    setLoading(false)
  }

  async function loadMessages(convId: string) {
    const { data } = await getMessages(convId)
    setMessages(data || [])
    await markMessagesAsRead(convId)
    loadConversations()
  }

  async function handleSend() {
    if (!newMessage.trim() || !selectedConv) return

    setSending(true)
    await sendMessage(selectedConv.id, newMessage)
    setNewMessage("")
    await loadMessages(selectedConv.id)
    setSending(false)
  }

  async function handleCreateConversation() {
    if (!newConvTitre.trim() || !newConvMessage.trim()) return

    setSending(true)
    const { data } = await createConversation(newConvTitre, newConvMessage)
    if (data) {
      setShowNewDialog(false)
      setNewConvTitre("")
      setNewConvMessage("")
      await loadConversations()
      setSelectedConv(data)
    }
    setSending(false)
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Hier"
    } else if (days < 7) {
      return d.toLocaleDateString("fr-FR", { weekday: "long" })
    }
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-500/20 text-red-400",
      manager: "bg-purple-500/20 text-purple-400",
      employe: "bg-blue-500/20 text-blue-400",
    }
    const labels: Record<string, string> = {
      admin: "Admin Invexia",
      manager: "Manager",
      employe: "Employé",
    }
    return <Badge className={colors[role] || colors.employe}>{labels[role] || role}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Liste des conversations */}
        <Card
          className={`bg-card/50 backdrop-blur-xl border-border/40 ${selectedConv ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 lg:w-96`}
        >
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                {isAdmin ? "Messages des clients" : "Support Invexia"}
              </CardTitle>
              {!isAdmin && (
                <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Nouveau
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card/95 backdrop-blur-xl border-border/40">
                    <DialogHeader>
                      <DialogTitle>Contacter le support Invexia</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Sujet</label>
                        <Input
                          placeholder="Ex: Question sur les fonctionnalités"
                          value={newConvTitre}
                          onChange={(e) => setNewConvTitre(e.target.value)}
                          className="mt-1 bg-background/50 border-border/40"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Message</label>
                        <Textarea
                          placeholder="Décrivez votre demande..."
                          value={newConvMessage}
                          onChange={(e) => setNewConvMessage(e.target.value)}
                          className="mt-1 min-h-[120px] bg-background/50 border-border/40"
                        />
                      </div>
                      <Button
                        onClick={handleCreateConversation}
                        disabled={sending || !newConvTitre.trim() || !newConvMessage.trim()}
                        className="w-full"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Envoyer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Aucune conversation</p>
                  {!isAdmin && <p className="text-sm mt-1">Cliquez sur "Nouveau" pour contacter le support</p>}
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConv?.id === conv.id ? "bg-primary/20 border border-primary/30" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{conv.titre}</p>
                          {conv.unread_count && conv.unread_count > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs px-1.5">
                              {conv.unread_count}
                            </Badge>
                          )}
                        </div>
                        {isAdmin && conv.entreprise && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {conv.entreprise.nom}
                          </p>
                        )}
                        {conv.last_message && (
                          <p className="text-sm text-muted-foreground truncate mt-1">{conv.last_message.contenu}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(conv.derniere_activite)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Zone de conversation */}
        <Card
          className={`bg-card/50 backdrop-blur-xl border-border/40 flex-1 flex flex-col ${!selectedConv ? "hidden md:flex" : "flex"}`}
        >
          {selectedConv ? (
            <>
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConv(null)}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{selectedConv.titre}</CardTitle>
                    {isAdmin && selectedConv.entreprise && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {selectedConv.entreprise.nom}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      selectedConv.statut === "ouvert"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-slate-500/20 text-slate-400"
                    }
                  >
                    {selectedConv.statut === "ouvert" ? "Ouvert" : "Fermé"}
                  </Badge>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === profil?.id
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] ${isMe ? "order-2" : ""}`}>
                          <div className={`flex items-center gap-2 mb-1 ${isMe ? "justify-end" : ""}`}>
                            <span className="text-xs font-medium">{msg.sender_nom}</span>
                            {getRoleBadge(msg.sender_role)}
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted/50 rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.contenu}</p>
                          </div>
                          <div
                            className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${isMe ? "justify-end" : ""}`}
                          >
                            <Clock className="w-3 h-3" />
                            {formatDate(msg.created_at)}
                            {isMe && msg.lu && <CheckCheck className="w-3 h-3 text-primary ml-1" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border/40">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    className="flex-1 bg-background/50 border-border/40"
                  />
                  <Button onClick={handleSend} disabled={sending || !newMessage.trim()}>
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  {isAdmin ? "Sélectionnez une conversation" : "Contactez le support Invexia"}
                </p>
                <p className="text-sm">
                  {isAdmin
                    ? "Répondez aux messages des clients"
                    : "Créez une nouvelle conversation pour nous contacter"}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

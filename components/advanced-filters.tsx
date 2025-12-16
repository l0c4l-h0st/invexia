"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"

interface FiltersProps {
  onApply: (filters: any) => void
  onClose: () => void
}

export function AdvancedFilters({ onApply, onClose }: FiltersProps) {
  const [filters, setFilters] = useState({
    category: "",
    priceMin: "",
    priceMax: "",
    stockStatus: "",
    dateRange: "all",
    sortBy: "name",
  })

  const handleApply = () => {
    onApply(filters)
  }

  return (
    <div className="glass rounded-xl border border-border/50 p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Filter size={20} />
          Advanced Filters
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
          <X size={20} />
        </button>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Categories</option>
          <option value="accessories">Accessories</option>
          <option value="electronics">Electronics</option>
          <option value="office">Office</option>
          <option value="cables">Cables</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Min Price</label>
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
            placeholder="0"
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Max Price</label>
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
            placeholder="999"
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <label className="block text-sm font-medium mb-2">Stock Status</label>
        <select
          value={filters.stockStatus}
          onChange={(e) => setFilters((prev) => ({ ...prev, stockStatus: e.target.value }))}
          className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Date Range</label>
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
          className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium mb-2">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
          className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="name">Product Name</option>
          <option value="price">Price (Low to High)</option>
          <option value="stock">Stock Level</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/50">
        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

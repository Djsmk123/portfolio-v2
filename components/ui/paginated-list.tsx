"use client"

import { useState, useEffect, ReactNode } from "react"
import { Pagination } from "@/components/ui/pagination"

interface PaginatedListProps<T> {
  fetchData: (page: number, limit: number) => Promise<{ data: T[], total: number }>
  renderItem: (item: T, index: number) => ReactNode
  renderSkeleton: () => ReactNode
  renderEmpty: () => ReactNode
  itemsPerPage?: number
  className?: string
  showCounter?: boolean
  counterLabel?: string
}

export function PaginatedList<T>({
  fetchData,
  renderItem,
  renderSkeleton,
  renderEmpty,
  itemsPerPage = 10,
  className = "",
  showCounter = true,
  counterLabel = "items"
}: PaginatedListProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const loadData = async (page: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchData(page, itemsPerPage)
      setData(result.data)
      setTotalItems(result.total)
    } catch (err) {
      setError("Failed to load data. Please try again.")
      console.error("Error loading data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(currentPage)
    // it's safe to omit fetchData since it is provided as a stable prop by caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    return (
      <div className={`p-4 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg ${className}`}>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <div key={i}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={className}>
        {renderEmpty()}
      </div>
    )
  }

  return (
    <>
      {/* Data List */}
      <div className={className}>
        {data.map((item, index) => renderItem(item, index))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Counter */}
      {showCounter && totalItems > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} {counterLabel}
        </div>
      )}
    </>
  )
}

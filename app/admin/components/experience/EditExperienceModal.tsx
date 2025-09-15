"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { experienceType } from "@/app/data/mock"
import { useEffect, useMemo, useState } from "react"

type Props = {
  exp: experienceType
  isNew: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (e: experienceType) => void
  onSave: () => void | Promise<void>
  isSaving: boolean
}

export function EditExperienceModal({
  exp,
  isNew,
  open,
  onOpenChange,
  onChange,
  onSave,
  isSaving,
}: Props) {
  const [startMonth, setStartMonth] = useState("")
  const [endMonth, setEndMonth] = useState("")
  const [isPresent, setIsPresent] = useState(false)

  useEffect(() => {
    const raw = (exp.date || "").trim()
    const parts = raw.split("-").map((s) => s.trim())
    if (parts.length >= 1 && /^\d{4}-\d{2}$/.test(parts[0])) setStartMonth(parts[0])
    if (parts.length >= 2) {
      if (/present/i.test(parts[1])) {
        setIsPresent(true)
        setEndMonth("")
      } else if (/^\d{4}-\d{2}$/.test(parts[1])) {
        setEndMonth(parts[1])
      }
    }
  }, [exp.date])

  function applyDateChange(nextStart: string, nextEnd: string, nextPresent: boolean) {
    const dateStr = nextStart
      ? `${nextStart} - ${nextPresent ? "Present" : nextEnd || ""}`.trim()
      : ""
    onChange({ ...exp, date: dateStr })
  }

  const dateErrors = useMemo(() => {
    const errs: string[] = []
    if (!startMonth) errs.push("Start month required")
    if (!isPresent && !endMonth) errs.push("End month required")
    if (startMonth && endMonth && !isPresent) {
      if (startMonth > endMonth) errs.push("End must be after start")
    }
    return errs
  }, [startMonth, endMonth, isPresent])

  const valid =
    exp.title.trim() &&
    exp.company.trim() &&
    exp.location.trim() &&
    exp.description.trim() &&
    dateErrors.length === 0 &&
    !!startMonth &&
    (isPresent || !!endMonth)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add New Experience" : "Edit Experience"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title + Active */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={exp.title}
                onChange={(e) => onChange({ ...exp, title: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Label htmlFor="is-active">Active</Label>
              <Switch
                id="is-active"
                checked={exp.isActive !== false}
                onCheckedChange={(c) =>
                  onChange({ ...exp, isActive: Boolean(c) })
                }
              />
            </div>
          </div>

          {/* Company + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={exp.company}
                onChange={(e) => onChange({ ...exp, company: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={exp.location}
                onChange={(e) => onChange({ ...exp, location: e.target.value })}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <Label htmlFor="start">Start</Label>
                <Input
                  id="start"
                  type="month"
                  value={startMonth}
                  onChange={(e) => {
                    const v = e.target.value
                    setStartMonth(v)
                    applyDateChange(v, endMonth, isPresent)
                  }}
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="end">End</Label>
                  <Input
                    id="end"
                    type="month"
                    value={endMonth}
                    disabled={isPresent}
                    onChange={(e) => {
                      const v = e.target.value
                      setEndMonth(v)
                      applyDateChange(startMonth, v, isPresent)
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="present">Present</Label>
                  <Switch
                    id="present"
                    checked={isPresent}
                    onCheckedChange={(c) => {
                      const b = Boolean(c)
                      setIsPresent(b)
                      if (b) setEndMonth("")
                      applyDateChange(startMonth, b ? "" : endMonth, b)
                    }}
                  />
                </div>
              </div>
            </div>
            {dateErrors.length > 0 && (
              <div className="text-xs text-red-500">{dateErrors.join(" • ")}</div>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={exp.description}
              onChange={(e) => onChange({ ...exp, description: e.target.value })}
            />
          </div>

          {!valid && (
            <div className="text-sm text-red-500">
              Please fill all required fields.
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving || !valid} type="button">
            {isSaving
              ? "Saving..."
              : isNew
              ? "Add Experience"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

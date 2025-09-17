"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Briefcase, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { experienceType } from "@/app/data/mock"
import JobDetails from "./JobDetails"
import PeriodPicker from "./PeriodPicker"

export type Props = {
exp: experienceType
  isNew: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (e: experienceType) => void
  onSave: () => void | Promise<void>
  isSaving: boolean
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

export default function EditExperienceModal ({
  exp,
  isNew,
  open,
  onOpenChange,
  onChange,
  onSave,
  isSaving,
}: Props) {
  const [startMonth, setStartMonth] = useState("")
  const [startYear, setStartYear] = useState("")
  const [endMonth, setEndMonth] = useState("")
  const [endYear, setEndYear] = useState("")
  const [isPresent, setIsPresent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // parse incoming value once
  useEffect(() => {
    const raw = (exp.date || "").trim()
    if (!raw) return
    const [startRaw, endRaw = ""] = (raw.includes(" - ") ? raw.split(" - ") : [raw, ""]).map(s => s.trim())
    if (/^\d{4}-\d{2}$/.test(startRaw)) {
      const [y, m] = startRaw.split("-")
      setStartYear(y)
      setStartMonth(String(parseInt(m)))
    }
    if (/present/i.test(endRaw)) {
      setIsPresent(true)
      setEndMonth("")
      setEndYear("")
    } else if (/^\d{4}-\d{2}$/.test(endRaw)) {
      const [y, m] = endRaw.split("-")
      setEndYear(y)
      setEndMonth(String(parseInt(m)))
      setIsPresent(false)
    }
  }, [exp.date])

  const formatDateString = useCallback(() => {
    if (!startMonth || !startYear) return ""
    const startStr = `${startYear}-${String(parseInt(startMonth)).padStart(2, '0')}`
    if (isPresent) return `${startStr} - Present`
    if (endMonth && endYear) {
      const endStr = `${endYear}-${String(parseInt(endMonth)).padStart(2, '0')}`
      return `${startStr} - ${endStr}`
    }
    return startStr
  }, [startMonth, startYear, endMonth, endYear, isPresent])

  // keep parent date in sync
  useEffect(() => {
    const dateStr = formatDateString()
    if (exp.date !== dateStr) onChange({ ...exp, date: dateStr })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatDateString])

  const validateForm = useCallback(() => {
    const next: Record<string, string> = {}
    if (!exp.title.trim()) next.title = "Job title is required"
    if (!exp.company.trim()) next.company = "Company name is required"
    if (!exp.location.trim()) next.location = "Location is required"
    if (!exp.description.trim()) next.description = "Description is required"
    if (!startMonth || !startYear) next.startDate = "Start date is required"
    if (!isPresent && (!endMonth || !endYear)) next.endDate = "End date is required (or mark as Present)"
    if (startYear && startMonth && endYear && endMonth && !isPresent) {
      const a = new Date(parseInt(startYear), parseInt(startMonth) - 1)
      const b = new Date(parseInt(endYear), parseInt(endMonth) - 1)
      if (b < a) next.dateRange = "End date cannot be before start date"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [exp, startMonth, startYear, endMonth, endYear, isPresent])

  const isValid = useMemo(() => (
    exp.title.trim() && exp.company.trim() && exp.location.trim() && exp.description.trim() &&
    startMonth && startYear && (isPresent || (endMonth && endYear))
  ), [exp, startMonth, startYear, endMonth, endYear, isPresent])

  const handleSave = useCallback(async () => {
    if (!validateForm()) return
    await Promise.resolve()
    await onSave()
  }, [validateForm, onSave])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h:[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            {isNew ? "Add New Experience" : "Edit Experience"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          <Card className="border-0 shadow-sm bg-muted/30">
            <CardContent className="pt-6 space-y-4">
              <JobDetails exp={exp} errors={errors} onChange={onChange} setErrors={setErrors} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-muted/30">
            <CardContent>
              <PeriodPicker
                months={months}
                years={years}
                startMonth={startMonth}
                startYear={startYear}
                endMonth={endMonth}
                endYear={endYear}
                isPresent={isPresent}
                errors={errors}
                setStartMonth={setStartMonth}
                setStartYear={setStartYear}
                setEndMonth={setEndMonth}
                setEndYear={setEndYear}
                setIsPresent={setIsPresent}
              />
              {errors.dateRange && (
                <Alert className="mt-4 border-destructive/20 bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">{errors.dateRange}</AlertDescription>
                </Alert>
              )}
              {startMonth && startYear && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration: {formatDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <Label htmlFor="is-active" className="text-sm font-medium">Mark as Active</Label>
              <p className="text-xs text-muted-foreground mt-1">Show this experience prominently on your profile</p>
            </div>
            {/* lightweight toggle using onChange from parent */}
            <input
              id="is-active"
              type="checkbox"
              className="h-4 w-4 accent-current"
              checked={exp.isActive !== false}
              onChange={e => onChange({ ...exp, isActive: e.target.checked })}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || !isValid} className="w-full sm:w-auto">
              {isSaving ? 'Saving...' : (isNew ? 'Add Experience' : 'Save Changes')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
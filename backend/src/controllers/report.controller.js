import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as reportService from '../services/report.service.js'

export const createReport = asyncHandler(async (req, res) => {
  const report = await reportService.createReport(req.user, req.body)
  res.status(201).json(apiResponse(report, 'Report created successfully'))
})

export const listMyReports = asyncHandler(async (req, res) => {
  const reports = await reportService.listMyReports(req.user._id)
  res.json(apiResponse(reports, 'Reports loaded successfully'))
})

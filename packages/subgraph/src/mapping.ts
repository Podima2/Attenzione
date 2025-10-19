import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import {
  StationCreated,
  CrimeReportSubmitted,
  AnonymousReportSubmitted,
} from "../generated/CrimeRegistry/CrimeRegistry";
import { Station, CrimeReport, DailyAggregation } from "../generated/schema";

export function handleStationCreated(event: StationCreated): void {
  let stationId = event.params.stationId.toString()
  let station = new Station(stationId)
  
  station.stationId = stationId.toString()
  station.name = event.params.name
  station.metro = event.params.metro
  station.lines = ""
  station.lineOrder = BigInt.zero()
  station.active = true
  station.createdAt = event.block.timestamp
  station.reportCount = BigInt.zero()
  station.save()
}

export function handleCrimeReportSubmitted(event: CrimeReportSubmitted): void {
  let reportId = event.params.reportId.toString()
  let stationId = event.params.stationId
  let report = new CrimeReport(reportId)

  report.reportId = event.params.reportId
  report.station = stationId
  report.stationId = stationId
  report.reporter = event.params.reporter.toHexString()
  report.severity = event.params.severity
  report.cid = event.params.cid
  report.description = ""
  report.timestamp = event.block.timestamp
  report.verified = event.params.verified
  report.save()

  let station = Station.load(stationId)
  if (station) {
    station.reportCount = station.reportCount.plus(BigInt.fromI32(1))
    station.save()
  }

  updateDailyAggregation(
    stationId,
    event.block.timestamp,
    event.params.severity as i32
  )
}

export function handleAnonymousReportSubmitted(
  event: AnonymousReportSubmitted
): void {
  let reportId = event.params.reportId.toString()
  let stationId = event.params.stationId
  let report = new CrimeReport(reportId)

  report.reportId = event.params.reportId
  report.station = stationId
  report.stationId = stationId
  report.reporter = null
  report.severity = event.params.severity
  report.cid = event.params.cid
  report.description = ""
  report.timestamp = event.block.timestamp
  report.verified = false
  report.save()

  let station = Station.load(stationId)
  if (station) {
    station.reportCount = station.reportCount.plus(BigInt.fromI32(1))
    station.save()
  }

  updateDailyAggregation(
    stationId,
    event.block.timestamp,
    event.params.severity as i32
  )
}

function updateDailyAggregation(
  stationId: string,
  timestamp: BigInt,
  severity: i32
): void {
  let dayTimestamp = timestamp.div(BigInt.fromI32(86400)).times(BigInt.fromI32(86400))
  let aggregationId = stationId + "-" + dayTimestamp.toString()

  let aggregation = DailyAggregation.load(aggregationId)
  if (!aggregation) {
    aggregation = new DailyAggregation(aggregationId)
    aggregation.stationId = stationId
    aggregation.date = dayTimestamp
    aggregation.reportCount = BigInt.zero()
    aggregation.avgSeverity = BigInt.zero().toBigDecimal()
    aggregation.highestSeverity = 0
  }

  aggregation.reportCount = aggregation.reportCount.plus(BigInt.fromI32(1))
  
  if (severity > aggregation.highestSeverity) {
    aggregation.highestSeverity = severity
  }
  
  let currentAvg = aggregation.avgSeverity
  let newCount = aggregation.reportCount
  let severityDecimal = BigInt.fromI32(severity).toBigDecimal()
  
  let oldTotal = currentAvg.times(newCount.minus(BigInt.fromI32(1)).toBigDecimal())
  let newTotal = oldTotal.plus(severityDecimal)
  aggregation.avgSeverity = newTotal.div(newCount.toBigDecimal())
  
  aggregation.save()
}
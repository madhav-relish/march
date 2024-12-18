import React from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"

import { SkeletonCard } from "./atoms/SkeletonCard"
import { useMeetings } from "../hooks/useMeetings"
import { Event } from "../lib/@types/Items/event"
import { Link, Link as LinkIcon } from "../lib/icons/Link"
import { MeetMuted, ZoomMuted } from "../lib/icons/Meet"

const getEventType = (event: Event): "google-meet" | "zoom" | "other" => {
  if (
    event.conferenceData?.conferenceSolution?.name === "Google Meet" ||
    event.conferenceData?.entryPoints.some((entry) =>
      entry.uri.includes("meet.google.com")
    )
  ) {
    return "google-meet"
  }

  if (
    event.conferenceData?.conferenceSolution?.name === "Zoom meeting" ||
    event.conferenceData?.entryPoints.some((entry) =>
      entry.uri.includes("zoom.us")
    ) ||
    event.location?.includes("zoom.us")
  ) {
    return "zoom"
  }

  return "other"
}
const MeetingIcon = ({ type, isActive }) => {
  switch (type) {
    case "google-meet":
      return isActive ? (
        <Icon icon="logos:google-meet" className="text-[12px]" />
      ) : (
        <div className="mt-[4px]">
          <MeetMuted />
        </div>
      )
    case "zoom":
      return isActive ? (
        <Icon icon="logos:zoom-icon" className={`pt-1 text-[15px]`} />
      ) : (
        <div className="mt-[4px]">
          <ZoomMuted />
        </div>
      )
    default:
      return (
        <div className={`mt-[6px]`}>
          <Link />
        </div>
      )
  }
}

const formatTime = (date: Date): string => {
  return date
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "")
    .toUpperCase()
}

const calculateDuration = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

interface TodayAgendaProps {
  selectedDate: Date
}

interface AgendaItem {
  title: string
  link: string
  time: string
  duration: number
  meetingType: string
}

export const TodayMeetings: React.FC<TodayAgendaProps> = ({ selectedDate }) => {
  const { meetings, isLoading } = useMeetings(selectedDate.toISOString())

  const agendaItems: AgendaItem[] =
    meetings?.map((event: Event) => {
      const startTime = new Date(event.start.dateTime)
      const endTime = new Date(event.end.dateTime)

      const meetingLink =
        event.conferenceData?.entryPoints.find(
          (entry) => entry.entryPointType === "video"
        )?.uri ||
        event.conferenceData?.entryPoints[0]?.uri ||
        event.location ||
        event.htmlLink

      return {
        title: event.summary,
        link: meetingLink,
        time: `${formatTime(startTime)}`,
        duration: calculateDuration(startTime, endTime),
        meetingType: getEventType(event),
      }
    }) || []

  if (isLoading) {
    return (
      <ol>
        <li className="text-lg font-medium text-[#DCDCDD]/80">
          <SkeletonCard />
        </li>
      </ol>
    )
  }

  return (
    <div>
      {agendaItems.length === 0 ? (
        <li className="list-none">No agenda items</li>
      ) : (
        <ol className="relative min-h-[150px] border-s border-border">
          {agendaItems.map((item, index) => (
            <li key={index} className="mb-8 ms-4">
              {index === 0 && (
                <div
                  className="absolute -start-[1px] h-4 w-px bg-white"
                  style={{ top: "calc(0.75rem + 38px)" }}
                />
              )}
              <span
                className={`absolute -start-12 bg-background p-3 ${
                  index === 0
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }`}
              >
                {item.time}
              </span>
              <a href={item.link} target="_blank">
                <div className="pt-11">
                  <h1
                    className={`text-[16px] font-medium ${
                      index === 0
                        ? "text-primary-foreground"
                        : "text-secondary-foreground"
                    }`}
                  >
                    {item.title}
                  </h1>
                  <p className="flex gap-2 text-[16px] font-medium text-secondary-foreground">
                    {item.duration} min
                    <span>
                      <MeetingIcon
                        type={item.meetingType}
                        isActive={index === 0}
                      />
                    </span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

"use client"

import React, { useEffect, useState } from "react"

import { Plus } from "@phosphor-icons/react"

import EachNote from "@/src/components/atoms/EachNote"
import TextEditor from "@/src/components/atoms/Editor"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/src/components/atoms/Resizable"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { type Note } from "@/src/lib/@types/Items/Note"
import useNotesStore from "@/src/lib/store/notes.store"

const NotesPage: React.FC = () => {
  const { session } = useAuth()

  const {
    fetchNotes,
    notes,
    isFetched,
    setIsFetched,
    updateNote,
    saveNote,
    addNote,
  } = useNotesStore()

  const fetchTheNotes = async (): Promise<void> => {
    await fetchNotes(session)
    setIsFetched(true)
  }

  useEffect(() => {
    void fetchTheNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [note, setNote] = useState<Note | null>(null)

  // Initialize with empty strings
  const [content, setContent] = React.useState(
    note?.content ?? "<p>create a new note to get started...</p>"
  )
  const [title, setTitle] = React.useState(
    note?.title ?? "You don't have any notes"
  )

  const editor = useEditorHook({ content, setContent })

  useEffect(() => {
    if (note !== null) {
      editor?.setEditable(true)
      return
    }
    if (!isFetched || notes.length === 0) {
      editor?.setEditable(false)
      return
    }
    editor?.setEditable(true)
    editor?.commands.setContent(notes[0].content)
    setNote(notes[0])
    setContent(notes[0].content)
    setTitle(notes[0].title)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, notes, isFetched])

  const handleSetNote = (uuid: string): void => {
    const note = notes.find((note) => note.uuid === uuid)
    if (note !== undefined) {
      setNote(note)
      setContent(note.content)
      setTitle(note.title)
      if (editor !== null) {
        editor.commands.setContent(note.content)
      }
    }
  }

  const addNewNote = async (): Promise<void> => {
    const newNote = await addNote(session, "", "<p></p>")
    if (newNote !== null) {
      setNote(newNote)
      setContent(newNote.content)
      setTitle(newNote.title)
      if (editor !== null) {
        editor.commands.setContent(newNote.content)
      }
    }
  }

  const updateTitle = (title: string): void => {
    setTitle(title)
    if (note !== null) {
      updateNote({ ...note, title })
    }
  }

  const saveNoteToServer = async (note: Note): Promise<void> => {
    await saveNote(session, note)
  }

  const isCreateEnabled = (): boolean => {
    if (!isFetched) {
      // disable if not fetched
      return false
    }
    if (notes.length === 0) {
      // enable if there are no notes
      return true
    }
    // enable if the first note title and content are not empty
    return notes[0].content !== "<p></p>" && notes[0].title.length > 0
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={75} minSize={40}>
        <div className="h-full overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-white/10 px-8 py-6 shadow-lg backdrop-blur-lg">
          <div className="flex w-full items-center justify-between px-3 text-zinc-400">
            <span>Notes</span>
            <button
              disabled={!isCreateEnabled()}
              //  eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={addNewNote}
              className="text-zinc-200 disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>
          <div
            onBlur={() => {
              if (note === null) {
                return
              }
              void saveNoteToServer({ ...note, title, content })
            }}
            className="mt-4 px-3"
          >
            <input
              type="text"
              name="title"
              value={title}
              disabled={notes.length === 0}
              onChange={(e) => {
                updateTitle(e.target.value)
              }}
              placeholder="Untitled"
              className="mb-10 w-full bg-transparent text-2xl font-semibold outline-none placeholder:text-zinc-500 focus:outline-none dark:text-zinc-200"
            />
            <TextEditor editor={editor} />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={25}>
        <div className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-lg">
          <div className="px-2 font-semibold text-zinc-400">
            <span>Notes</span>
          </div>
          <div className="mt-8 flex flex-col gap-y-2">
            {notes?.map((n) => (
              <EachNote
                key={n.uuid}
                note={n}
                handleSetNote={handleSetNote}
                isActive={n.uuid === note?.uuid}
              />
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default NotesPage
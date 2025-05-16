sequenceDiagram
participant Browser
participant Server

Browser->>Browser: Capture note content and timestamp
Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa (note data as JSON format)
Server-->>Browser: 201 Created (or status response)

Browser->>Browser: Add new note to UI (without reload)

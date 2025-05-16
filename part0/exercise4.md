sequenceDiagram
participant Browser
participant Server

    Browser->>Browser: Capture input and create note object through a form element with attributes action ('/new_note') and method ('POST')
    Browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Note right of Server: Server creates the note object with date and time, and saves it in the array of notes. Responds with a redirect

    Server-->>Browser: HTTP 302 Redirect to https://studies.cs.helsinki.fi/exampleapp/notes
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.jsonactivate server
    server-->>browser: [old list..., new_note]
    deactivate server
    Browser->>Browser: Re-render updated notes list

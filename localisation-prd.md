# Website Localizer - Frontend PRD

## Overview
Minimalist chat interface for localizing websites (AU→US English). Two-page app with clean, modern design.

**Stack**: React + TypeScript + MUI + react-syntax-highlighter + Lodash

---

## Pages

### 1. Landing Page
```
┌─────────────────────────────────────────┐
│                                         │
│         [Logo] Website Localizer        │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Enter website URL...         [→] │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Transform AU English sites to US       │
│                                         │
└─────────────────────────────────────────┘
```

**Components**:
- Centered input field (MUI `TextField`)
- Submit button/icon
- Simple tagline
- No navigation, no header

---

### 2. Chat + Preview Page

```
┌──────────────────────────────────────────────────────────┐
│  [← Back]                              [Export HTML]     │
├─────────────────────┬────────────────────────────────────┤
│                     │                                    │
│  Chat (35%)         │  Preview (65%)                     │
│                     │                                    │
│  User:              │  ┌──────────────────────────────┐ │
│  example.com        │  │                              │ │
│                     │  │                              │ │
│  AI:                │  │    Localized Website         │ │
│  ✅ Localized       │  │    (Iframe)                  │ │
│                     │  │                              │ │
│  • 20 changes       │  │                              │ │
│  • Dates updated    │  │                              │ │
│                     │  │                              │ │
│  Try these:         │  │                              │ │
│  [Make casual]      │  │                              │ │
│  [Fix pricing]      │  └──────────────────────────────┘ │
│                     │                                    │
│  ┌─────────────┐    │                                    │
│  │ Message [↑] │    │                                    │
│  └─────────────┘    │                                    │
│                     │                                    │
└─────────────────────┴────────────────────────────────────┘
```

**Features**:
- **Chat Panel**: Messages + suggestions + input
- **Preview Panel**: Localized version only (no original)
- **Text Prompter**: Auto-generated suggestions after localization
- **Code Display**: Use `react-syntax-highlighter` for any HTML/code snippets in chat

---

## Components

```typescript
App
├── LandingPage
│   ├── URLInput
│   └── SubmitButton
│
└── WorkspacePage
    ├── Header
    │   ├── BackButton
    │   └── ExportButton
    │
    ├── ChatPanel
    │   ├── MessageThread
    │   │   ├── Message
    │   │   └── CodeBlock (react-syntax-highlighter)
    │   ├── SuggestionChips
    │   └── ChatInput
    │
    └── PreviewPanel
        └── Iframe (localized content only)
```

---

## State

```typescript
interface AppState {
  page: 'landing' | 'workspace';
  
  // Chat
  messages: Message[];
  isLoading: boolean;
  
  // Content
  sourceUrl: string;
  localizedHtml: string;
  
  // Suggestions
  suggestions: string[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeSnippet?: string; // For syntax highlighting
}
```

---

## Libraries

### react-syntax-highlighter
```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

<SyntaxHighlighter language="html" style={vscDarkPlus}>
  {htmlCode}
</SyntaxHighlighter>
```

**Usage**: Display HTML snippets in AI responses

### Lodash
```typescript
import _ from 'lodash';

// Debounce chat input
const debouncedSend = _.debounce(sendMessage, 300);

// Group/process data if needed
const grouped = _.groupBy(changes, 'type');
```

**Usage**: Utility functions, debouncing, data manipulation

---

## Design System

### Colors
```typescript
{
  primary: '#2563eb',     // Blue accent
  background: '#ffffff',  
  surface: '#f8fafc',     // Chat bubbles
  border: '#e2e8f0',
  text: '#0f172a'
}
```

### Typography
- **Font**: Inter or system font
- **Sizes**: 14px (body), 16px (input), 12px (suggestions)

### Spacing
- Chat padding: 20px
- Message gap: 16px
- Suggestion gap: 8px

---

## Interactions

### Landing → Workspace Flow
1. User enters URL
2. Navigate to `/workspace`
3. Show loading in chat
4. Display AI response + localized preview
5. Show suggestion chips

### Chat Flow
1. User types or clicks suggestion
2. Disable input, show loading
3. AI responds with changes
4. Preview updates
5. New suggestions appear

### Code Highlighting
- Any HTML/CSS in AI responses auto-highlighted
- Copy button on code blocks
- Dark theme for contrast

---

## API Endpoints

```typescript
// Initial localization
POST /api/localize
{ url: string }
→ { localizedHtml: string, changes: string[], suggestions: string[] }

// Chat
POST /api/chat  
{ message: string, currentHtml: string }
→ { response: string, updatedHtml?: string, suggestions?: string[] }

// Export
GET /api/export
→ Blob (HTML file download)
```

---

## Routing

```typescript
// React Router
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/workspace" element={<WorkspacePage />} />
</Routes>
```

---

## Key Features

**Text Prompter (Auto-suggestions)**
After localization, AI generates 3-4 action suggestions:
- "Make tone more casual"
- "Adjust date formats"  
- "Update measurements"
- "Change currency symbols"

Display as clickable chips below AI message.

**No Original View**
Only show localized version. Simplifies UI and focuses on output.

**Back Button**
Returns to landing page, clears state (or confirm dialog if unsure).

---

## Open Questions

1. Should we store chat history in localStorage?
2. Max number of suggestions to show?
3. Mobile breakpoint for stacked layout?
4. Streaming AI responses or instant?
5. Syntax highlighting theme preference?
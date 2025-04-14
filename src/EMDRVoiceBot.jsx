import { useEffect, useRef, useState } from 'react'

export default function EMDRVoiceBot() {
  const [isListening, setIsListening] = useState(false)
  const [log, setLog] = useState([])
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    synthRef.current.speak(utter)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }
    const recognition = new webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setLog((prev) => [...prev, `You: ${transcript}`])
      handleResponse(transcript)
    }

    recognition.onerror = (event) => {
      setLog((prev) => [...prev, `Error: ${event.error}`])
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const handleResponse = (text) => {
    let response = "I'm here with you. Take a deep breath."

    if (text.toLowerCase().includes('stop')) {
      response = "Okay, let’s pause. You’re in control."
    } else if (text.toLowerCase().includes('continue')) {
      response = "Let’s keep going. Bring the memory back and follow the moving dot on the screen."
    } else if (text.toLowerCase().includes('scared') || text.toLowerCase().includes('anxious')) {
      response = "That’s okay. You’re safe here. Let’s take a moment to breathe together."
    }

    setLog((prev) => [...prev, `Bot: ${response}`])
    speak(response)
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>EMDR Voice Bot (Prototype)</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={startListening}
          disabled={isListening}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {isListening ? 'Listening…' : 'Start Session'}
        </button>
      </div>
      <div style={{ textAlign: 'left', backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', height: '200px', overflowY: 'scroll' }}>
        {log.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
        Speak keywords like "continue", "stop", "anxious", "scared" to guide the bot.
      </p>
    </div>
  )
}
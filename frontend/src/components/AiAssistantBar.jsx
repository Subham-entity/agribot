import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, Navigation, X } from 'lucide-react';
import { sendAiQuery } from '../api';

const QUICK_PROMPTS = [
  "Predicted Tomato price in 1 month?",
  "Nearby cold storages & godowns?",
  "Active buyer bulk demands",
  "How to upload harvested produce?",
  "FPO Circle trade transparency"
];

export default function AiAssistantBar({ userRole, onNavigate }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Hinglish support

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSend(transcript, true);
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error/cancelled:", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          simulateVoiceInput();
        }
      } else {
        // Fallback simulation for browser environments without speech permissions
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      const simulatedText = "What will Tomato price be next month?";
      setQuery(simulatedText);
      setIsListening(false);
      handleSend(simulatedText, true);
    }, 1800);
  };

  const handleSend = async (textToSend = query, isVoice = false) => {
    const q = textToSend.trim();
    if (!q) return;

    setLoading(true);
    try {
      const result = await sendAiQuery(q, userRole, isVoice);
      setResponse(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-input-box">
        <Sparkles size={18} color="#059669" style={{ flexShrink: 0 }} />
        
        <input
          type="text"
          className="ai-text-input"
          placeholder={isListening ? "Listening to your voice query..." : "Ask AI: Mandi rates, weather, storage, guidance..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Voice Input Button */}
        <button
          className={`ai-action-btn voice-mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          title={isListening ? "Stop listening" : "Click to speak (Voice Query)"}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Send Button */}
        <button
          className="ai-action-btn send-query-btn"
          onClick={() => handleSend()}
          disabled={loading || !query.trim()}
          title="Send query"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Listening Wave Indicator */}
      {isListening && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '10px 0' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dc2626' }}>Recording voice query...</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span 
                key={i} 
                style={{ 
                  width: 3, 
                  height: 16, 
                  background: '#dc2626', 
                  borderRadius: 2,
                  animation: `pulse-mic ${0.6 + i * 0.15}s infinite ease-in-out` 
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Suggestion Chips */}
      <div className="ai-suggestion-chips">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            className="ai-chip"
            onClick={() => {
              setQuery(prompt);
              handleSend(prompt);
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* AI Response Card */}
      {response && (
        <div className="ai-reply-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="ai-pill" style={{ background: '#059669', color: '#ffffff' }}>
                Agri-Advisor AI
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Contextual Recommendation</span>
            </div>
            <button
              onClick={() => setResponse(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={15} />
            </button>
          </div>

          <p className="ai-reply-text">{response.reply}</p>

          {response.navigation_target && response.navigation_target !== 'Home' && (
            <div style={{ marginTop: 10 }}>
              <button
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 4 }}
                onClick={() => {
                  if (onNavigate) onNavigate(response.navigation_target);
                  setResponse(null);
                }}
              >
                <Navigation size={13} />
                <span>Go to {response.navigation_target} Screen</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

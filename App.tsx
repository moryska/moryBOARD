import React, { useState } from 'react';
import { Board } from './components/Board';
import { Compose } from './components/Compose';
import { Reader } from './components/Reader';
import { ViewState, EncryptedMessage } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const { language, setLanguage, t } = useLanguage();
  const [view, setView] = useState<ViewState>(ViewState.BOARD);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [createdMessageData, setCreatedMessageData] = useState<{msg: EncryptedMessage, key: string} | null>(null);

  const handleSelectMessage = (id: string) => {
    setActiveMessageId(id);
    setView(ViewState.READ);
  };

  const handleCreateSuccess = (msg: EncryptedMessage, key: string) => {
    setCreatedMessageData({ msg, key });
  };

  const handleFinishCreation = () => {
    setCreatedMessageData(null);
    setView(ViewState.BOARD);
  };

  return (
    <div className="h-screen w-screen selection:bg-[#00ff41] selection:text-black overflow-hidden flex flex-col">
      
      {/* Background Effects */}
      <div className="screen-border"></div>
      <div className="tron-grid"></div>
      <div className="horizon-glow"></div>
      <div className="top-gradient"></div>
      <div className="scanlines"></div>
      
      {/* Language Switcher */}
      <div className="fixed bottom-4 right-4 z-[70] flex border border-[#005511] bg-black/90 backdrop-blur shadow-[0_0_15px_rgba(0,0,0,1)]">
         <button 
           onClick={() => setLanguage('DE')}
           className={`px-3 py-1 text-xs font-bold transition-all ${language === 'DE' ? 'bg-[#00ff41] text-black' : 'text-[#005511] hover:text-[#00ff41]'}`}
         >
           DE
         </button>
         <div className="w-[1px] bg-[#005511]"></div>
         <button 
           onClick={() => setLanguage('EN')}
           className={`px-3 py-1 text-xs font-bold transition-all ${language === 'EN' ? 'bg-[#00ff41] text-black' : 'text-[#005511] hover:text-[#00ff41]'}`}
         >
           EN
         </button>
      </div>

      <main className="relative z-10 w-full flex-1 overflow-hidden flex flex-col">
        
        {/* Always Render Board in Background */}
        <Board 
          onSelectMessage={handleSelectMessage} 
          onCreateNew={() => setView(ViewState.COMPOSE)} 
        />

        {/* Compose Overlay (Full Screen takeover for now, or modal) */}
        {view === ViewState.COMPOSE && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto pt-16 md:pt-20 pb-10 flex items-center justify-center">
            {!createdMessageData ? (
              <Compose 
                onCancel={() => setView(ViewState.BOARD)}
                onSuccess={handleCreateSuccess}
              />
            ) : (
              // Success View (Key Display)
              <div className="max-w-[95vw] md:max-w-5xl mx-auto animate-slide-up relative z-20 px-2 w-full">
                <div className="glass-panel p-1 shadow-[0_0_100px_rgba(0,255,65,0.3)]">
                  <div className="bg-[#050505]/95 p-6 md:p-12 text-center">
                    
                    <h2 className="text-xl md:text-3xl font-bold text-[#e0ffe0] mb-2 uppercase tracking-widest glow-text border-b border-[#00ff41]/50 pb-6">
                      {t.transmissionLocked}
                    </h2>
                    <p className="text-[#008f11] mt-4 mb-8 text-xs md:text-sm font-bold tracking-wider break-words">
                      {t.target} <strong className="text-[#00ff41] md:ml-2 block md:inline text-base md:text-xl">{createdMessageData.msg.codename}</strong>
                    </p>
                    
                    <div className="bg-black/90 border-2 border-[#00ff41] py-8 md:py-16 mb-8 relative group shadow-[inset_0_0_50px_rgba(0,255,65,0.2)] overflow-hidden">
                      <div className="absolute top-0 left-0 bg-[#00ff41] text-black px-4 py-1 text-xs md:text-sm font-bold uppercase tracking-widest z-10">{t.decryptionKey}</div>
                      
                      {/* Scanline inside key box */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>

                      <div className="relative z-10 flex justify-center items-center px-2">
                          {/* Resized Key with Share Tech Mono font to fit one line on mobile */}
                          <p className="text-3xl sm:text-4xl md:text-6xl font-key text-[#00ff41] tracking-widest font-bold glow-text key-glitch selection:bg-white selection:text-black whitespace-nowrap overflow-hidden">
                            {createdMessageData.key}
                          </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
                        <button 
                        onClick={() => {
                            navigator.clipboard.writeText(createdMessageData.key);
                            alert(t.copied);
                        }}
                        className="text-sm uppercase bg-[#002200] hover:bg-[#00ff41] text-[#00ff41] hover:text-black px-8 md:px-12 py-4 font-bold transition-all border border-[#004411] tracking-widest shadow-[0_0_15px_rgba(0,255,65,0.1)] hover:shadow-[0_0_25px_rgba(0,255,65,0.4)] w-full md:w-auto whitespace-nowrap"
                        >
                        {t.copyClipboard}
                        </button>
                    </div>

                    <div className="border-l-4 border-red-500 bg-red-900/10 p-4 text-xs md:text-sm text-red-400 mb-8 text-left font-mono leading-relaxed">
                      <p>
                        <strong className="text-red-500 text-sm block mb-1 uppercase tracking-wider glitch-hover w-max">{t.warningTitle}</strong> 
                        {t.warningBody}
                      </p>
                    </div>

                    <button 
                      onClick={handleFinishCreation}
                      className="w-full bg-[#00ff41] hover:bg-[#ccffcc] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] text-black font-bold py-4 uppercase tracking-[0.2em] transition-all text-sm md:text-lg whitespace-nowrap"
                    >
                      {t.returnBoard}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reader Overlay (Modal Window) */}
        {view === ViewState.READ && activeMessageId && (
          <Reader 
            messageId={activeMessageId}
            onClose={() => {
              setActiveMessageId(null);
              setView(ViewState.BOARD);
            }} 
          />
        )}

      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
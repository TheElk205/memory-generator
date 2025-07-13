"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface BingoField {
  id: number;
  fullText: string;
  shortText: string;
  isFixed: boolean;
}

export default function BingoGenerator() {
  const [fields, setFields] = useState<BingoField[]>([
    { id: 1, fullText: "Erste fixe Aufgabe", shortText: "Fix 1", isFixed: true },
    { id: 2, fullText: "Zweite fixe Aufgabe", shortText: "Fix 2", isFixed: true },
    { id: 3, fullText: "Dritte fixe Aufgabe", shortText: "Fix 3", isFixed: true },
    { id: 4, fullText: "Vierte fixe Aufgabe", shortText: "Fix 4", isFixed: true },
    { id: 5, fullText: "Fünfte fixe Aufgabe", shortText: "Fix 5", isFixed: true },
    { id: 6, fullText: "Sechste fixe Aufgabe", shortText: "Fix 6", isFixed: true },
    { id: 7, fullText: "", shortText: "", isFixed: false },
    { id: 8, fullText: "", shortText: "", isFixed: false },
    { id: 9, fullText: "", shortText: "", isFixed: false }
  ]);
  const [bingoTemplate, setBingoTemplate] = useState<string>('/bingo-template.png');
  const [bingoBackside, setBingoBackside] = useState<string>('/bingo-backside.png');
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [horizontalScaling, setHorizontalScaling] = useState<number>(90);
  const [horizontalShift, setHorizontalShift] = useState<number>(4);
  const [verticalScaling, setVerticalScaling] = useState<number>(54);
  const [verticalShift, setverticalShift] = useState<number>(30);
  const [textSize, setTextSize] = useState<number>(1.1);
  const [displayOrder, setDisplayOrder] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const baseSize = 200; // Actual preview image size
  const printHeight = 600; // Fixed print height
  const scale = printHeight / baseSize; // Dynamic scale based on print height

  useEffect(() => {
    const savedFields = localStorage.getItem('bingo-fields');

    if (savedFields) {
      try {
        const parsedFields = JSON.parse(savedFields);
        if (Array.isArray(parsedFields) && parsedFields.length === 9) {
          setFields(parsedFields);
        }
      } catch (error) {
        console.error('Error loading saved bingo fields:', error);
      }
    }

    const savedBingoTemplate = localStorage.getItem('bingo-template');
    if (savedBingoTemplate) {
      setBingoTemplate(savedBingoTemplate);
    }

    const savedBingoBackside = localStorage.getItem('bingo-backside');
    if (savedBingoBackside) {
      setBingoBackside(savedBingoBackside);
    }

    const savedAdvancedMode = localStorage.getItem('bingo-advanced-mode');
    if (savedAdvancedMode) {
      setAdvancedMode(JSON.parse(savedAdvancedMode));
    }

    const savedHorizontalSpacing = localStorage.getItem('bingo-horizontal-spacing');
    if (savedHorizontalSpacing) {
      setHorizontalScaling(parseInt(savedHorizontalSpacing));
    }

    const savedVerticalSpacing = localStorage.getItem('bingo-vertical-spacing');
    if (savedVerticalSpacing) {
      setVerticalScaling(parseInt(savedVerticalSpacing));
    }

    const savedTextSize = localStorage.getItem('bingo-text-size');
    if (savedTextSize) {
      setTextSize(parseInt(savedTextSize));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bingo-fields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem('bingo-template', bingoTemplate);
  }, [bingoTemplate]);

  useEffect(() => {
    localStorage.setItem('bingo-backside', bingoBackside);
  }, [bingoBackside]);

  useEffect(() => {
    localStorage.setItem('bingo-advanced-mode', JSON.stringify(advancedMode));
  }, [advancedMode]);

  useEffect(() => {
    localStorage.setItem('bingo-horizontal-spacing', horizontalScaling.toString());
  }, [horizontalScaling]);

  useEffect(() => {
    localStorage.setItem('bingo-vertical-spacing', verticalScaling.toString());
  }, [verticalScaling]);

  useEffect(() => {
    localStorage.setItem('bingo-text-size', textSize.toString());
  }, [textSize]);

  const updateField = (id: number, field: 'fullText' | 'shortText', value: string) => {
    setFields(fields.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const resetFields = () => {
    if (confirm('Sind Sie sicher, dass Sie alle Eingaben zurücksetzen möchten?')) {
      setFields([
        { id: 1, fullText: "Erste fixe Aufgabe", shortText: "Fix 1", isFixed: true },
        { id: 2, fullText: "Zweite fixe Aufgabe", shortText: "Fix 2", isFixed: true },
        { id: 3, fullText: "Dritte fixe Aufgabe", shortText: "Fix 3", isFixed: true },
        { id: 4, fullText: "Vierte fixe Aufgabe", shortText: "Fix 4", isFixed: true },
        { id: 5, fullText: "Fünfte fixe Aufgabe", shortText: "Fix 5", isFixed: true },
        { id: 6, fullText: "Sechste fixe Aufgabe", shortText: "Fix 6", isFixed: true },
        { id: 7, fullText: "", shortText: "", isFixed: false },
        { id: 8, fullText: "", shortText: "", isFixed: false },
        { id: 9, fullText: "", shortText: "", isFixed: false }
      ]);
      setHorizontalScaling(90);
      setHorizontalShift(4);
      setVerticalScaling(54);
      setverticalShift(30);
      setTextSize(1.1);
    }
  };

  const handleImageUpload = (type: 'template' | 'backside', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'template') {
          setBingoTemplate(result);
        } else {
          setBingoBackside(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImages = () => {
    if (confirm('Möchten Sie die Bilder auf die Standardvorlagen zurücksetzen?')) {
      setBingoTemplate('/bingo-template.png');
      setBingoBackside('/bingo-backside.png');
    }
  };

  const randomizeFields = () => {
    const shuffled = [...displayOrder].sort(() => Math.random() - 0.5);
    setDisplayOrder(shuffled);
  };

  const resetFieldOrder = () => {
    setDisplayOrder([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const baseURL = window.location.origin;
    
    // Use the same percentage-based positioning as the preview
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BINGO-Karten</title>
          <style>
            @page { 
              size: A4 landscape; 
              margin: 10mm; 
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { 
              margin: 0; 
              font-family: Arial, sans-serif; 
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              gap: 20px;
            }
            .bingo-card {
              position: relative;
              height: ${printHeight}px;
              width: auto;
              aspect-ratio: var(--card-aspect-ratio, 1);
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
            }
            .bingo-grid {
              position: absolute;
              top: 0;
              left: 0;
              width: ${horizontalScaling}%;
              height: ${verticalScaling}%;
              margin-left: ${horizontalShift}%;
              margin-top: ${verticalShift}%;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-template-rows: repeat(3, 1fr);
              gap: 0;
              box-sizing: border-box;
            }
            .bingo-cell {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: ${4 * scale}px;
              font-size: ${textSize}rem;
              font-weight: bold;
              text-align: center;
              color: #000;
              line-height: 1.2;
            }
          </style>
          <script>
            window.onload = function() {
              const frontsideCards = document.querySelectorAll('.frontside');
              const backsideCards = document.querySelectorAll('.backside');
              
              const setImageAndAspectRatio = (cards, imageSrc) => {
                const img = new Image();
                img.onload = function() {
                  const aspectRatio = this.width / this.height;
                  cards.forEach(card => {
                    card.style.backgroundImage = 'url(' + imageSrc + ')';
                    card.style.setProperty('--card-aspect-ratio', aspectRatio);
                  });
                };
                img.src = imageSrc;
              };
              
              setImageAndAspectRatio(frontsideCards, '${bingoTemplate.startsWith('/') ? baseURL + bingoTemplate : bingoTemplate}');
              setImageAndAspectRatio(backsideCards, '${bingoBackside.startsWith('/') ? baseURL + bingoBackside : bingoBackside}');
              
              setTimeout(() => {
                window.print();
              }, 1500);
            };
          </script>
        </head>
        <body>
          <div class="bingo-card frontside">
            <div class="bingo-grid">
              ${displayOrder.map((fieldId) => {
                const field = fields.find(f => f.id === fieldId);
                return `
                  <div class="bingo-cell">
                    ${field?.shortText || field?.fullText || `Feld ${fieldId}`}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <div class="bingo-card backside"></div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-800">Lebenshilfe Generator</h1>
              <div className="flex space-x-1">
                <a
                  href="/"
                  className="px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                >
                  Memory Generator
                </a>
                <a
                  href="/bingo"
                  className="px-4 py-2 text-white bg-purple-600 rounded-md font-medium"
                >
                  BINGO Generator
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>
      
      <div className="container mx-auto p-6 max-w-4xl">
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-black">BINGO Felder</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-black">Fixe Felder (1-6)</h3>
            <div className="space-y-4">
              {fields.filter(f => f.isFixed).map((field) => (
                <div key={field.id} className="flex gap-4 items-end border-b pb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-black">
                      Volltext (Feld {field.id})
                    </label>
                    <input
                      type="text"
                      value={field.fullText}
                      onChange={(e) => updateField(field.id, 'fullText', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      placeholder="Vollständiger Text eingeben"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-black">
                      Kurztext (für BINGO-Karte)
                    </label>
                    <input
                      type="text"
                      value={field.shortText}
                      onChange={(e) => updateField(field.id, 'shortText', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      placeholder="Kurzer Text für Karte"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 text-black">Freie Felder (7-9)</h3>
            <div className="space-y-4">
              {fields.filter(f => !f.isFixed).map((field) => (
                <div key={field.id} className="flex gap-4 items-end border-b pb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-black">
                      Volltext (Feld {field.id})
                    </label>
                    <input
                      type="text"
                      value={field.fullText}
                      onChange={(e) => updateField(field.id, 'fullText', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      placeholder="Vollständiger Text eingeben"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-black">
                      Kurztext (für BINGO-Karte)
                    </label>
                    <input
                      type="text"
                      value={field.shortText}
                      onChange={(e) => updateField(field.id, 'shortText', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      placeholder="Kurzer Text für Karte"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6 flex-wrap">
          <button
            onClick={resetFields}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Zurücksetzen
          </button>
          
          <button
            onClick={randomizeFields}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Felder mischen
          </button>
          
          <button
            onClick={resetFieldOrder}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Reihenfolge zurücksetzen
          </button>
          
          <button
            onClick={() => setAdvancedMode(!advancedMode)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            {advancedMode ? 'Einfacher Modus' : 'Erweiterter Modus'}
          </button>
          
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            BINGO-Karte drucken (A4)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Vorschau</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-black">BINGO-Vorlage</h3>
              {advancedMode && (
                <label className="bg-green-500 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-green-600">
                  Ändern
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('template', e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="border rounded-lg overflow-hidden relative">
              <Image 
                src={bingoTemplate} 
                alt="BINGO template" 
                width={baseSize} 
                height={baseSize}
                className="w-full h-auto"
              />
              <div 
                className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0"
                style={{
                  width: `${Math.max(0, horizontalScaling)}%`,
                  height: `${Math.max(0, verticalScaling)}%`,
                  marginLeft: `${Math.max(0, horizontalShift)}%`,
                  marginTop: `${Math.max(0, verticalShift)}%`,
                }}
              >
                {displayOrder.map((fieldId) => {
                  const field = fields.find(f => f.id === fieldId);
                  return (
                    <div 
                      key={fieldId}
                      className="flex items-center justify-center p-1 font-bold text-center text-black"
                      style={{ fontSize: `${textSize}rem` }}
                    >
                      <span className="leading-tight">
                        {field?.shortText || field?.fullText || `Feld ${fieldId}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-black">Rückseiten-Vorlage</h3>
              {advancedMode && (
                <label className="bg-green-500 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-green-600">
                  Ändern
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('backside', e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Image 
                src={bingoBackside} 
                alt="BINGO backside" 
                width={200} 
                height={200}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {advancedMode && (
          <div className="mb-6 space-y-4">
            <button
              onClick={resetImages}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
            >
              Bilder zurücksetzen
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Horizontaler Skalierung: {horizontalScaling}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={horizontalScaling}
                  onChange={(e) => setHorizontalScaling(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Vertikaler Skalierung: {verticalScaling}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={verticalScaling}
                  onChange={(e) => setVerticalScaling(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Horizontaler Verschub: {horizontalShift}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={horizontalShift}
                  onChange={(e) => setHorizontalShift(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Vertikaler Verschub: {verticalShift}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={verticalShift}
                  onChange={(e) => setverticalShift(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Textgröße: {textSize}rem
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={textSize}
                  onChange={(e) => setTextSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        )}
        
      </div>

      <footer className="mt-8 py-4 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>
          Erstellt mit ❤️ von{" "}
          <a 
            href="https://claude.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Claude AI
          </a>
          {" "}und{" "}
          <a 
            href="mailto:ferdinand@koeppen.tech" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Ferdinand
          </a>
          {" "}für die Lebenshilfe Kärnten
        </p>
      </footer>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface MemoryPair {
  id: number;
  text1: string;
  text2: string;
  text1Size: number;
  text2Size: number;
}

export default function MemoryGenerator() {
  const [pairs, setPairs] = useState<MemoryPair[]>([
    { id: 1, text1: "", text2: "", text1Size: 18, text2Size: 18 }
  ]);
  const [backsideImage, setBacksideImage] = useState<string>('/backside.png');
  const [frontsideImage, setFrontsideImage] = useState<string>('/template.png');
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedPairs = localStorage.getItem('memory-game-pairs');
    if (savedPairs) {
      try {
        const parsedPairs = JSON.parse(savedPairs);
        if (Array.isArray(parsedPairs) && parsedPairs.length > 0) {
          setPairs(parsedPairs);
        }
      } catch (error) {
        console.error('Error loading saved pairs:', error);
      }
    }

    const savedBacksideImage = localStorage.getItem('memory-game-backside-image');
    if (savedBacksideImage) {
      setBacksideImage(savedBacksideImage);
    }

    const savedFrontsideImage = localStorage.getItem('memory-game-frontside-image');
    if (savedFrontsideImage) {
      setFrontsideImage(savedFrontsideImage);
    }

    const savedAdvancedMode = localStorage.getItem('memory-game-advanced-mode');
    if (savedAdvancedMode) {
      setAdvancedMode(JSON.parse(savedAdvancedMode));
    }
  }, []);

  // Save to localStorage whenever pairs change
  useEffect(() => {
    localStorage.setItem('memory-game-pairs', JSON.stringify(pairs));
  }, [pairs]);

  // Save images to localStorage
  useEffect(() => {
    localStorage.setItem('memory-game-backside-image', backsideImage);
  }, [backsideImage]);

  useEffect(() => {
    localStorage.setItem('memory-game-frontside-image', frontsideImage);
  }, [frontsideImage]);

  useEffect(() => {
    localStorage.setItem('memory-game-advanced-mode', JSON.stringify(advancedMode));
  }, [advancedMode]);

  const addPair = () => {
    const newId = Math.max(...pairs.map(p => p.id)) + 1;
    setPairs([...pairs, { id: newId, text1: "", text2: "", text1Size: 18, text2Size: 18 }]);
  };

  const removePair = (id: number) => {
    if (pairs.length > 1) {
      setPairs(pairs.filter(p => p.id !== id));
    }
  };

  const updatePair = (id: number, field: 'text1' | 'text2', value: string) => {
    setPairs(pairs.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const updateTextSize = (id: number, field: 'text1Size' | 'text2Size', value: number) => {
    setPairs(pairs.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const resetPairs = () => {
    if (confirm('Sind Sie sicher, dass Sie alle Eingaben zurücksetzen möchten?')) {
      setPairs([{ id: 1, text1: "", text2: "", text1Size: 18, text2Size: 18 }]);
    }
  };

  const handleImageUpload = (type: 'backside' | 'frontside', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'backside') {
          setBacksideImage(result);
        } else {
          setFrontsideImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImages = () => {
    if (confirm('Möchten Sie die Bilder auf die Standardvorlagen zurücksetzen?')) {
      setBacksideImage('/backside.png');
      setFrontsideImage('/template.png');
    }
  };

  const getTextSizeClass = (text: string) => {
    if (text.length <= 10) return 'short';
    if (text.length <= 20) return 'medium';
    return 'long';
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cards = pairs.filter(p => p.text1.trim() && p.text2.trim());
    const baseURL = window.location.origin;

    // Create all card sides (frontside and backside for each pair)
    const allCardSides: Array<{type: 'frontside' | 'backside', text?: string, fontSize?: number}> = [];
    
    cards.forEach(pair => {
      allCardSides.push(
        { type: 'frontside', text: pair.text1, fontSize: pair.text1Size },
        { type: 'backside' },
        { type: 'frontside', text: pair.text2, fontSize: pair.text2Size },
        { type: 'backside' }
      );
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Memory-Karten</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .card { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
              }
            }
            body { 
              margin: 0; 
              font-family: Arial, sans-serif; 
            }
            .page {
              width: 190mm;
              height: 277mm;
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr 1fr;
              gap: 5mm;
              page-break-after: always;
              padding: 5mm;
              box-sizing: border-box;
            }
            .card { 
              width: 100%;
              height: 100%;
              display: flex; 
              align-items: center; 
              justify-content: center; 
              position: relative;
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
              border: 1px solid #ddd;
              box-sizing: border-box;
            }
            .card-text {
              font-weight: bold;
              text-align: center;
              color: #000;
              max-width: 80%;
              line-height: 1.2;
              transform: rotate(270deg);
              z-index: 10;
              position: absolute;
            }
          </style>
          <script>
            // Preload images
            const backsideImg = new Image();
            const templateImg = new Image();
            backsideImg.src = '${baseURL}/backside.png';
            templateImg.src = '${baseURL}/template.png';
            
            window.onload = function() {
              const backsideCards = document.querySelectorAll('.backside');
              const frontsideCards = document.querySelectorAll('.frontside');
              
              backsideCards.forEach(card => {
                card.style.backgroundImage = 'url(${backsideImage.startsWith('/') ? baseURL + backsideImage : backsideImage})';
              });
              
              frontsideCards.forEach(card => {
                card.style.backgroundImage = 'url(${frontsideImage.startsWith('/') ? baseURL + frontsideImage : frontsideImage})';
              });
              
              setTimeout(() => {
                window.print();
              }, 2000);
            };
          </script>
        </head>
        <body>
    `);

    // Group cards into pages of 4
    for (let i = 0; i < allCardSides.length; i += 4) {
      const pageCards = allCardSides.slice(i, i + 4);
      
      printWindow.document.write('<div class="page">');
      
      pageCards.forEach(card => {
        if (card.type === 'frontside') {
          printWindow.document.write(`
            <div class="card frontside">
              <div class="card-text" style="font-size: ${card.fontSize}px;">${card.text}</div>
            </div>
          `);
        } else {
          printWindow.document.write('<div class="card backside"></div>');
        }
      });
      
      // Fill remaining slots if less than 4 cards
      for (let j = pageCards.length; j < 4; j++) {
        printWindow.document.write('<div class="card" style="border: 1px dashed #ccc;"></div>');
      }
      
      printWindow.document.write('</div>');
    }

    printWindow.document.write(`
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-600">
        Memory-Spiel Generator
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Textpaare</h2>
        
        <div className="space-y-4">
          {pairs.map((pair) => (
            <div key={pair.id} className="flex gap-4 items-end border-b pb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-black">Karte 1</label>
                <input
                  type="text"
                  value={pair.text1}
                  onChange={(e) => updatePair(pair.id, 'text1', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  placeholder="Text für die erste Karte eingeben"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-black">Karte 2</label>
                <input
                  type="text"
                  value={pair.text2}
                  onChange={(e) => updatePair(pair.id, 'text2', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  placeholder="Text für die zweite Karte eingeben"
                />
              </div>
              
              <button
                onClick={() => removePair(pair.id)}
                disabled={pairs.length === 1}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={addPair}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Paar hinzufügen
          </button>
          
          <button
            onClick={resetPairs}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Zurücksetzen
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
            disabled={!pairs.some(p => p.text1.trim() && p.text2.trim())}
          >
            Karten drucken (A4)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Vorschau</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                src={backsideImage} 
                alt="Card backside" 
                width={200} 
                height={280}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-black">Vorderseiten-Vorlage</h3>
              {advancedMode && (
                <label className="bg-green-500 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-green-600">
                  Ändern
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('frontside', e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Image 
                src={frontsideImage} 
                alt="Card template" 
                width={200} 
                height={280}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {advancedMode && (
          <div className="mt-4">
            <button
              onClick={resetImages}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
            >
              Bilder zurücksetzen
            </button>
          </div>
        )}

        {pairs.some(p => p.text1.trim() || p.text2.trim()) && (
          <div className="mt-6">
            <h3 className="font-medium mb-4 text-black">Vorschau mit Text</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pairs.filter(p => p.text1.trim() || p.text2.trim()).map(pair => (
                <div key={pair.id} className="space-y-4">
                  {pair.text1.trim() && (
                    <div className="space-y-2">
                      <div className="relative border rounded-lg overflow-hidden">
                        <Image 
                          src={frontsideImage} 
                          alt="Card template" 
                          width={150} 
                          height={210}
                          className="w-full h-auto"
                        />
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <span 
                            className="text-center font-bold text-black leading-tight transform rotate-[270deg]"
                            style={{ fontSize: `${Math.max(8, pair.text1Size * 0.75)}px` }}
                          >
                            {pair.text1}
                          </span>
                        </div>
                      </div>
                      {advancedMode && (
                        <div>
                          <label className="block text-xs font-medium mb-1 text-black">
                            Karte 1 Textgröße: {pair.text1Size}px
                          </label>
                          <input
                            type="range"
                            min="8"
                            max="64"
                            value={pair.text1Size}
                            onChange={(e) => updateTextSize(pair.id, 'text1Size', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {pair.text2.trim() && (
                    <div className="space-y-2">
                      <div className="relative border rounded-lg overflow-hidden">
                        <Image 
                          src={frontsideImage} 
                          alt="Card template" 
                          width={150} 
                          height={210}
                          className="w-full h-auto"
                        />
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <span 
                            className="text-center font-bold text-black leading-tight transform rotate-[270deg]"
                            style={{ fontSize: `${Math.max(8, pair.text2Size * 0.75)}px` }}
                          >
                            {pair.text2}
                          </span>
                        </div>
                      </div>
                      {advancedMode && (
                        <div>
                          <label className="block text-xs font-medium mb-1 text-black">
                            Karte 2 Textgröße: {pair.text2Size}px
                          </label>
                          <input
                            type="range"
                            min="8"
                            max="64"
                            value={pair.text2Size}
                            onChange={(e) => updateTextSize(pair.id, 'text2Size', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
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
  );
}
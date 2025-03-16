import React, { useState } from 'react';
import { Skull, BookOpen, Shuffle, GhostIcon, Eye, Brain, Building, Code, Loader2 } from 'lucide-react';
import { generateStory } from './lib/storyGenerator';

type Motif = {
  name: string;
  description: string;
  category: string;
};

function App() {
  const [selectedMotif, setSelectedMotif] = useState<string>('');
  const [readLength, setReadLength] = useState<'short' | 'long'>('short');
  const [story, setStory] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  const motifs: Motif[] = [
    {
      name: 'Surprise Me',
      description: 'Let fate decide your horror...',
      category: 'Random',
    },
    // Supernatural Entities
    {
      name: 'Skinwalkers',
      description: 'Shape-shifting creatures from Native American lore',
      category: 'Supernatural Entities',
    },
    {
      name: 'Wendigos',
      description: 'Cannibalistic spirits from Algonquian-speaking peoples\' folklore',
      category: 'Supernatural Entities',
    },
    {
      name: 'Shadow People',
      description: 'Dark humanoid figures that lurk in peripheral vision',
      category: 'Supernatural Entities',
    },
    {
      name: 'Doppelgangers',
      description: 'Mysterious copies of living people',
      category: 'Supernatural Entities',
    },
    {
      name: 'Black-Eyed Children',
      description: 'Young beings with completely black eyes',
      category: 'Supernatural Entities',
    },
    {
      name: 'Angels',
      description: 'Terrifying, biblical accurate entities',
      category: 'Supernatural Entities',
    },
    {
      name: 'Demons',
      description: 'Malevolent entities and possession stories',
      category: 'Supernatural Entities',
    },
    // Modern Horror
    {
      name: 'Haunted Technology',
      description: 'Cursed apps, websites, or devices',
      category: 'Modern Horror',
    },
    {
      name: 'Found Footage',
      description: 'Discovered recordings containing disturbing content',
      category: 'Modern Horror',
    },
    {
      name: 'Internet Mysteries',
      description: 'Deep web encounters and strange online phenomena',
      category: 'Modern Horror',
    },
    {
      name: 'AI Gone Wrong',
      description: 'Artificial intelligence becoming malevolent',
      category: 'Modern Horror',
    },
    {
      name: 'Social Media Horror',
      description: 'Stalkers, mysterious profiles, or cursed posts',
      category: 'Modern Horror',
    },
    // Psychological Horror
    {
      name: 'Time Loops',
      description: 'Characters trapped in repeating scenarios',
      category: 'Psychological Horror',
    },
    {
      name: 'Reality Distortion',
      description: 'World slowly becoming unfamiliar',
      category: 'Psychological Horror',
    },
    {
      name: 'Sleep Paralysis',
      description: 'Encounters during sleep paralysis episodes',
      category: 'Psychological Horror',
    },
    {
      name: 'Missing Time',
      description: 'Unexplained gaps in memory',
      category: 'Psychological Horror',
    },
    {
      name: 'Alternate Dimensions',
      description: 'Parallel worlds bleeding into ours',
      category: 'Psychological Horror',
    },
    // Location-Based
    {
      name: 'Backrooms',
      description: 'Liminal spaces and endless rooms',
      category: 'Location-Based',
    },
    {
      name: 'Small Town Secrets',
      description: 'Isolated communities with dark traditions',
      category: 'Location-Based',
    },
    {
      name: 'Forest Encounters',
      description: 'Strange experiences in remote woodlands',
      category: 'Location-Based',
    },
    {
      name: 'Urban Exploration',
      description: 'Abandoned places with dark histories',
      category: 'Location-Based',
    },
    {
      name: 'Deep Sea Horror',
      description: 'Oceanic mysteries and creatures',
      category: 'Location-Based',
    },
    // Experimental/Meta
    {
      name: 'Breaking the Fourth Wall',
      description: 'Stories that interact with readers',
      category: 'Experimental/Meta',
    },
    {
      name: 'Rules/Guidelines',
      description: 'Lists of survival rules that must be followed',
      category: 'Experimental/Meta',
    },
    {
      name: 'Unreliable Narrator',
      description: 'Stories where the narrator\'s perception can\'t be trusted',
      category: 'Experimental/Meta',
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Supernatural Entities':
        return <GhostIcon className="w-5 h-5" />;
      case 'Modern Horror':
        return <Code className="w-5 h-5" />;
      case 'Psychological Horror':
        return <Brain className="w-5 h-5" />;
      case 'Location-Based':
        return <Building className="w-5 h-5" />;
      case 'Experimental/Meta':
        return <Eye className="w-5 h-5" />;
      default:
        return <Shuffle className="w-5 h-5" />;
    }
  };

  const handleGenerateStory = async () => {
    if (!selectedMotif) {
      setError('Please select a motif first');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setStory('');
    setDebugInfo('');
    
    try {
      // Add debug info about environment
      setDebugInfo('Checking API configuration...');
      console.log('Environment check:', {
        apiKeyExists: !!import.meta.env.ANTHROPIC_API_KEY,
        apiKeyLength: import.meta.env.ANTHROPIC_API_KEY?.length || 0,
        isDevelopment: import.meta.env.DEV,
        baseUrl: window.location.origin,
      });

      const generatedStory = await generateStory({
        motif: selectedMotif,
        readLength,
      });
      setStory(generatedStory);
      setDebugInfo('Story generated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
      setError(errorMessage);
      setDebugInfo(`Error occurred: ${errorMessage}`);
      console.error('Story generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-500 mb-4">NoSleep Story Generator</h1>
          <p className="text-gray-400 text-lg">Generate spine-chilling tales that will keep you awake at night</p>
        </header>

        <div className="space-y-12">
          {/* Motif Selection */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Choose Your Nightmare</h2>
            <div className="relative">
              <select
                value={selectedMotif}
                onChange={(e) => setSelectedMotif(e.target.value)}
                className="w-full bg-gray-700 text-gray-100 py-3 px-4 pr-8 rounded-lg border-2 border-gray-600 focus:border-red-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">Select a motif...</option>
                {Array.from(new Set(['Random', ...motifs.map(m => m.category)])).map(category => (
                  <optgroup key={category} label={category}>
                    {motifs
                      .filter(m => (category === 'Random' ? m.category === 'Random' : m.category === category))
                      .map(motif => (
                        <option key={motif.name} value={motif.name}>
                          {motif.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Skull className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {selectedMotif && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(motifs.find(m => m.name === selectedMotif)?.category || '')}
                  <p className="text-gray-300">
                    {motifs.find(m => m.name === selectedMotif)?.description}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Reading Length Selection */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Reading Duration</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setReadLength('short')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                  readLength === 'short'
                    ? 'border-red-500 bg-gray-700'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                }`}
              >
                <div className="flex flex-col items-center">
                  <BookOpen className="w-6 h-6 mb-3 text-red-400" />
                  <h3 className="font-semibold mb-2">Short Read</h3>
                  <p className="text-sm text-gray-400">Less than 10 minutes</p>
                </div>
              </button>

              <button
                onClick={() => setReadLength('long')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                  readLength === 'long'
                    ? 'border-red-500 bg-gray-700'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                }`}
              >
                <div className="flex flex-col items-center">
                  <BookOpen className="w-6 h-6 mb-3 text-red-400" />
                  <h3 className="font-semibold mb-2">Long Read</h3>
                  <p className="text-sm text-gray-400">More than 10 minutes</p>
                </div>
              </button>
            </div>
          </section>

          {/* Generate Button */}
          <button
            onClick={handleGenerateStory}
            disabled={isGenerating}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Crafting Your Nightmare...
              </>
            ) : (
              'Generate Your Nightmare'
            )}
          </button>

          {/* Debug Info */}
          {debugInfo && (
            <div className="p-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-400 font-mono text-sm">
              <h3 className="font-semibold mb-2">Debug Information:</h3>
              <pre className="whitespace-pre-wrap">{debugInfo}</pre>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900/50 border-2 border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Generated Story */}
          {story && (
            <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Your Tale of Horror</h2>
              <div className="prose prose-invert max-w-none">
                {story.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
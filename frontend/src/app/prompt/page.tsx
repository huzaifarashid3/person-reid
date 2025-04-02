'use client';

import { useState } from 'react';
import { useTargetContext } from '../context/TargetContext';

interface PromptOptions {
  // Basic Appearance
  includeAppearance: boolean;
  skinColor: string[];
  height: string;
  build: string;
  customAppearance: string;
  
  // Clothing
  includeClothing: boolean;
  topClothing: string[];
  bottomClothing: string[];
  footwear: string[];
  accessories: string[];
  customClothing: string;
  
  // Physical Features
  includePhysicalFeatures: boolean;
  hairStyle: string[];
  hairColor: string[];
  facialFeatures: string[];
  customFeatures: string;
  
  // Behavior and Posture
  includeBehavior: boolean;
  posture: string[];
  action: string[];
  movement: string[];
  customBehavior: string;
  
  // Additional Details
  includeAdditionalDetails: boolean;
  carryingItems: string[];
  locationContext: string[];
  customDetails: string;
}

export default function PromptPage() {
  const { addTextTarget } = useTargetContext();
  const [options, setOptions] = useState<PromptOptions>({
    includeAppearance: true,
    skinColor: [],
    height: '',
    build: '',
    customAppearance: '',
    
    includeClothing: true,
    topClothing: [],
    bottomClothing: [],
    footwear: [],
    accessories: [],
    customClothing: '',
    
    includePhysicalFeatures: true,
    hairStyle: [],
    hairColor: [],
    facialFeatures: [],
    customFeatures: '',
    
    includeBehavior: true,
    posture: [],
    action: [],
    movement: [],
    customBehavior: '',
    
    includeAdditionalDetails: true,
    carryingItems: [],
    locationContext: [],
    customDetails: '',
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [editablePrompt, setEditablePrompt] = useState('');
  const [targetName, setTargetName] = useState('');

  const handleOptionChange = (key: keyof PromptOptions, value: boolean | number | string | string[]) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayOptionChange = (key: keyof PromptOptions, value: string, checked: boolean) => {
    setOptions((prev) => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter((item) => item !== value),
    }));
  };

  const generatePrompt = () => {
    const parts: string[] = [];
    
    if (options.includeAppearance) {
      const appearanceParts = [];
      if (options.skinColor.length > 0) {
        appearanceParts.push(`skin color: ${options.skinColor.join(', ')}`);
      }
      if (options.height) {
        appearanceParts.push(`height: ${options.height}`);
      }
      if (options.build) {
        appearanceParts.push(`build: ${options.build}`);
      }
      if (options.customAppearance) {
        appearanceParts.push(options.customAppearance);
      }
      if (appearanceParts.length > 0) {
        parts.push(`physical appearance (${appearanceParts.join(', ')})`);
      }
    }

    if (options.includeClothing) {
      const clothingParts = [];
      if (options.topClothing.length > 0) {
        clothingParts.push(`top: ${options.topClothing.join(', ')}`);
      }
      if (options.bottomClothing.length > 0) {
        clothingParts.push(`bottom: ${options.bottomClothing.join(', ')}`);
      }
      if (options.footwear.length > 0) {
        clothingParts.push(`footwear: ${options.footwear.join(', ')}`);
      }
      if (options.accessories.length > 0) {
        clothingParts.push(`accessories: ${options.accessories.join(', ')}`);
      }
      if (options.customClothing) {
        clothingParts.push(options.customClothing);
      }
      if (clothingParts.length > 0) {
        parts.push(`clothing (${clothingParts.join(', ')})`);
      }
    }

    if (options.includePhysicalFeatures) {
      const featureParts = [];
      if (options.hairStyle.length > 0) {
        featureParts.push(`hair style: ${options.hairStyle.join(', ')}`);
      }
      if (options.hairColor.length > 0) {
        featureParts.push(`hair color: ${options.hairColor.join(', ')}`);
      }
      if (options.facialFeatures.length > 0) {
        featureParts.push(`facial features: ${options.facialFeatures.join(', ')}`);
      }
      if (options.customFeatures) {
        featureParts.push(options.customFeatures);
      }
      if (featureParts.length > 0) {
        parts.push(`physical features (${featureParts.join(', ')})`);
      }
    }

    if (options.includeBehavior) {
      const behaviorParts = [];
      if (options.posture.length > 0) {
        behaviorParts.push(`posture: ${options.posture.join(', ')}`);
      }
      if (options.action.length > 0) {
        behaviorParts.push(`action: ${options.action.join(', ')}`);
      }
      if (options.movement.length > 0) {
        behaviorParts.push(`movement: ${options.movement.join(', ')}`);
      }
      if (options.customBehavior) {
        behaviorParts.push(options.customBehavior);
      }
      if (behaviorParts.length > 0) {
        parts.push(`behavior (${behaviorParts.join(', ')})`);
      }
    }

    if (options.includeAdditionalDetails) {
      const detailParts = [];
      if (options.carryingItems.length > 0) {
        detailParts.push(`carrying: ${options.carryingItems.join(', ')}`);
      }
      if (options.locationContext.length > 0) {
        detailParts.push(`location: ${options.locationContext.join(', ')}`);
      }
      if (options.customDetails) {
        detailParts.push(options.customDetails);
      }
      if (detailParts.length > 0) {
        parts.push(`additional details (${detailParts.join(', ')})`);
      }
    }

    const prompt = `Analyze the following aspects for person re-identification: ${parts.join(', ')}.`;
    setGeneratedPrompt(prompt);
    setEditablePrompt(prompt);
  };

  const saveToTargets = () => {
    if (editablePrompt && targetName.trim()) {
      addTextTarget(targetName.trim(), editablePrompt);
      setGeneratedPrompt('');
      setEditablePrompt('');
      setTargetName('');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Prompt Builder</h1>

      <div className="space-y-6">
        {/* Basic Appearance */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Appearance</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeAppearance}
                onChange={(e) => handleOptionChange('includeAppearance', e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Include Basic Appearance</span>
            </label>
            
            <div className="ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Skin Color</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Fair', 'Light', 'Medium', 'Dark', 'Very Dark'].map((color) => (
                    <label key={color} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.skinColor.includes(color)}
                        onChange={(e) => handleArrayOptionChange('skinColor', color, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <select
                  value={options.height}
                  onChange={(e) => handleOptionChange('height', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select height...</option>
                  <option value="Very Short">Very Short</option>
                  <option value="Short">Short</option>
                  <option value="Average">Average</option>
                  <option value="Tall">Tall</option>
                  <option value="Very Tall">Very Tall</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Build</label>
                <select
                  value={options.build}
                  onChange={(e) => handleOptionChange('build', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select build...</option>
                  <option value="Slim">Slim</option>
                  <option value="Athletic">Athletic</option>
                  <option value="Average">Average</option>
                  <option value="Stocky">Stocky</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Appearance Details</label>
                <input
                  type="text"
                  value={options.customAppearance}
                  onChange={(e) => handleOptionChange('customAppearance', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add any additional appearance details..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clothing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Clothing</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeClothing}
                onChange={(e) => handleOptionChange('includeClothing', e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Include Clothing</span>
            </label>

            <div className="ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Top Clothing</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['T-shirt', 'Shirt', 'Sweater', 'Jacket', 'Coat', 'Dress'].map((item) => (
                    <label key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.topClothing.includes(item)}
                        onChange={(e) => handleArrayOptionChange('topClothing', item, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bottom Clothing</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Jeans', 'Pants', 'Shorts', 'Skirt', 'Dress'].map((item) => (
                    <label key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.bottomClothing.includes(item)}
                        onChange={(e) => handleArrayOptionChange('bottomClothing', item, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Footwear</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Sneakers', 'Boots', 'Shoes', 'Sandals', 'High Heels'].map((item) => (
                    <label key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.footwear.includes(item)}
                        onChange={(e) => handleArrayOptionChange('footwear', item, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Accessories</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Bag', 'Backpack', 'Hat', 'Glasses', 'Watch', 'Jewelry'].map((item) => (
                    <label key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.accessories.includes(item)}
                        onChange={(e) => handleArrayOptionChange('accessories', item, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Clothing Details</label>
                <input
                  type="text"
                  value={options.customClothing}
                  onChange={(e) => handleOptionChange('customClothing', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add any additional clothing details..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Physical Features */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Physical Features</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includePhysicalFeatures}
                onChange={(e) => handleOptionChange('includePhysicalFeatures', e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Include Physical Features</span>
            </label>

            <div className="ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hair Style</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Short', 'Medium', 'Long', 'Curly', 'Straight', 'Wavy'].map((style) => (
                    <label key={style} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.hairStyle.includes(style)}
                        onChange={(e) => handleArrayOptionChange('hairStyle', style, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hair Color</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White'].map((color) => (
                    <label key={color} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.hairColor.includes(color)}
                        onChange={(e) => handleArrayOptionChange('hairColor', color, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Facial Features</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Beard', 'Mustache', 'Glasses', 'Facial Hair', 'Clean Shaven'].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.facialFeatures.includes(feature)}
                        onChange={(e) => handleArrayOptionChange('facialFeatures', feature, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Physical Features</label>
                <input
                  type="text"
                  value={options.customFeatures}
                  onChange={(e) => handleOptionChange('customFeatures', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add any additional physical features..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Behavior and Posture */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Behavior and Posture</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeBehavior}
                onChange={(e) => handleOptionChange('includeBehavior', e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Include Behavior and Posture</span>
            </label>

            <div className="ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Posture</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Standing', 'Sitting', 'Walking', 'Running', 'Bending'].map((posture) => (
                    <label key={posture} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.posture.includes(posture)}
                        onChange={(e) => handleArrayOptionChange('posture', posture, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{posture}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Action</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Talking', 'Using Phone', 'Carrying Items', 'Looking Around', 'Interacting'].map((action) => (
                    <label key={action} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.action.includes(action)}
                        onChange={(e) => handleArrayOptionChange('action', action, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{action}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Movement</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Walking Fast', 'Walking Slow', 'Running', 'Stopping', 'Changing Direction'].map((movement) => (
                    <label key={movement} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.movement.includes(movement)}
                        onChange={(e) => handleArrayOptionChange('movement', movement, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{movement}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Behavior Details</label>
                <input
                  type="text"
                  value={options.customBehavior}
                  onChange={(e) => handleOptionChange('customBehavior', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add any additional behavior details..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Additional Details</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeAdditionalDetails}
                onChange={(e) => handleOptionChange('includeAdditionalDetails', e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Include Additional Details</span>
            </label>

            <div className="ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Carrying Items</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Bag', 'Backpack', 'Shopping Bag', 'Laptop', 'Phone', 'Umbrella'].map((item) => (
                    <label key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.carryingItems.includes(item)}
                        onChange={(e) => handleArrayOptionChange('carryingItems', item, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location Context</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {['Indoor', 'Outdoor', 'Street', 'Store', 'Office', 'Public Space'].map((location) => (
                    <label key={location} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.locationContext.includes(location)}
                        onChange={(e) => handleArrayOptionChange('locationContext', location, e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span>{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Additional Details</label>
                <input
                  type="text"
                  value={options.customDetails}
                  onChange={(e) => handleOptionChange('customDetails', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add any other details..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={generatePrompt}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate Prompt
          </button>

          {generatedPrompt && (
            <button
              onClick={saveToTargets}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save to Targets
            </button>
          )}
        </div>

        {generatedPrompt && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Name
              </label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter a name for this target..."
              />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Generated Prompt:</h3>
              <textarea
                value={editablePrompt}
                onChange={(e) => setEditablePrompt(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                placeholder="Edit your prompt here..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
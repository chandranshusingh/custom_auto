// Test utility for model loading
export const testModels = {
  testCar: {
    name: 'Test Car',
    path: '/models/cars/test-car.gltf',
    expectedSize: 648, // bytes
    expectedLoadTime: 100 // ms
  }
};

export const validateModelLoad = async (modelPath: string) => {
  try {
    console.log(`🧪 Testing model load: ${modelPath}`);
    const startTime = performance.now();
    
    const response = await fetch(modelPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const loadTime = performance.now() - startTime;
    const size = parseInt(response.headers.get('content-length') || '0');
    
    console.log(`✅ Model loaded successfully:`);
    console.log(`   - Load time: ${loadTime.toFixed(1)}ms`);
    console.log(`   - Size: ${size} bytes`);
    console.log(`   - URL: ${modelPath}`);
    
    return {
      success: true,
      loadTime,
      size,
      path: modelPath
    };
  } catch (error) {
    console.error(`❌ Model load failed: ${modelPath}`);
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      path: modelPath
    };
  }
};

// Test all configured models
export const testAllModels = async () => {
  console.log('🔬 Starting model loading tests...');
  const results = [];
  
  for (const [name, config] of Object.entries(testModels)) {
    console.log(`\n📝 Testing ${name}...`);
    const result = await validateModelLoad(config.path);
    results.push({ name, ...result });
  }
  
  console.log('\n📊 Test Results Summary:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.success ? 'PASS' : 'FAIL'}`);
  });
  
  return results;
};

// Simple client test to verify Expo can start
const { execSync } = require('child_process');

console.log('🧪 Testing client setup...');

try {
    // Check if dependencies are installed
    execSync('npm list expo', { stdio: 'pipe' });
    console.log('✅ Expo dependencies installed');
    
    // Check if TypeScript compiles
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript compilation successful');
    
    console.log('🎉 Client setup tests passed!');
} catch (error) {
    console.error('❌ Client test failed:', error.message);
    process.exit(1);
}

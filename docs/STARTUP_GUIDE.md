# Startup Guide - Auto Customizer 3D Platform

**Document ID:** AC-STARTUP-V1.0  
**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: 🚧 **PHASE 1 DEVELOPMENT** - Next.js development environment operational

---

## 🚀 **QUICK START**

### **One-Command Startup**

```bash
# Complete development environment startup (recommended)
npm run dev
```

### **Manual Startup**

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Start testing in watch mode (separate terminal)
npm run test:watch
```

---

## 🛠️ **PREREQUISITES**

### **System Requirements**

- **OS**: Windows 10/11, macOS, or Linux
- **Node.js**: 18.0+ (LTS recommended)
- **npm**: 9.0+ or yarn 1.22+
- **Memory**: 8GB+ RAM (3D development intensive)
- **GPU**: Dedicated GPU recommended for 3D development
- **Storage**: 5GB+ free space (3D models, dependencies)

### **Environment Setup**

```bash
# 1. Clone repository
git clone <repository-url> auto-customizer
cd auto-customizer

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

---

## 🔧 **STARTUP PROCEDURES**

### **1. Development Startup (Recommended)**

#### **Using Next.js Development Server**

```bash
# Complete development environment startup
npm run dev
```

#### **What the Development Server Does**

1. **Starts Next.js development server** (port 3000)
2. **Enables hot module replacement**
3. **Compiles TypeScript in real-time**
4. **Runs ESLint validation**
5. **Provides 3D scene debugging tools**

#### **Expected Output**

```
✅ Next.js 14.1.0
✅ Local: http://localhost:3000
✅ TypeScript compilation successful
✅ Ready in 2.3s
🎯 Phase 1 Development Mode Active
```

### **2. TDD Development Workflow**

#### **TDD-First Development Setup**

```bash
# 1. Navigate to project root
cd auto-customizer

# 2. Start development server
npm run dev

# 3. Start TDD watch mode (separate terminal)
npm run test:watch

# 4. Run full validation before commits
npm run validate
```

#### **Verification Commands**

```bash
# Check development server
curl http://localhost:3000/

# Check 3D scene health
curl http://localhost:3000/api/health

# Run type checking
npm run type-check
```

---

## 🔍 **HEALTH CHECKS & VALIDATION** {#health-checks}

### **Development Environment Verification**

```bash
# Next.js development server health
curl http://localhost:3000/api/health 2>/dev/null && echo "✅ Next.js Server: Healthy" || echo "❌ Next.js Server: Unhealthy"

# 3D Scene rendering verification
node -e "console.log('✅ Node.js:', process.version); console.log('✅ Environment: Ready')"
```

### **Port Status Check**

```bash
# Check development server port
lsof -ti:3000 >/dev/null && echo "✅ Port 3000: Next.js Development Server" || echo "❌ Port 3000: Not in use"

# Check for port conflicts
netstat -tulpn | grep :3000 || echo "Port 3000 available"
```

### **TDD Environment Verification** {#tdd-verification}

```bash
# Verify testing framework
npm run test -- --version 2>/dev/null && echo "✅ Jest: Ready" || echo "❌ Jest: Not configured"

# Check TypeScript compilation
npm run type-check && echo "✅ TypeScript: No errors" || echo "❌ TypeScript: Compilation errors"

# Verify 3D dependencies
node -e "try { require('@react-three/fiber'); console.log('✅ React Three Fiber: Loaded'); } catch(e) { console.log('❌ 3D Dependencies: Missing'); }"
```

### **Quality Gates Verification** {#quality-gates}

```bash
# Run complete validation suite
npm run validate

# Individual quality checks
npm run lint     # ESLint validation
npm run format   # Prettier formatting check
npm test         # Test suite execution
```

---

## 🚨 **TROUBLESHOOTING** {#troubleshooting}

### **Common Development Issues**

#### **1. Port 3000 Already in Use** {#port-conflicts}

```bash
# Problem: Port 3000 already in use
# Solution: Kill existing Next.js processes or use different port

# Check what's using port 3000
lsof -ti:3000

# Kill process using port 3000
kill -9 $(lsof -ti:3000)

# Alternative: Start on different port
npm run dev -- -p 3001
```

#### **2. Node.js/npm Version Issues** {#node-version}

```bash
# Problem: Incompatible Node.js version
# Solution: Verify and update Node.js version

# Check versions
node --version  # Should be 18.0+
npm --version   # Should be 9.0+

# Update npm if needed
npm install -g npm@latest

# Clear npm cache if issues persist
npm cache clean --force
```

#### **3. TypeScript Compilation Errors** {#typescript-errors}

```bash
# Problem: TypeScript compilation fails
# Solution: Check and fix type errors

# Run type checking
npm run type-check

# Check specific TypeScript configuration
cat tsconfig.json | grep "strict"

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### **4. 3D Scene Rendering Issues** {#3d-rendering}

```bash
# Problem: 3D models not loading or WebGL errors
# Solution: Check browser support and model files

# Check WebGL support
node -e "console.log('Check WebGL support in browser DevTools -> Console -> WebGL')"

# Verify 3D model files exist
ls public/models/*.glb 2>/dev/null && echo "✅ 3D Models found" || echo "❌ 3D Models missing"

# Check 3D dependencies
npm list @react-three/fiber @react-three/drei three
```

#### **5. Test Framework Issues** {#test-issues}

```bash
# Problem: Jest tests not running or failing
# Solution: Verify testing setup

# Check Jest configuration
cat jest.config.js || echo "Jest config missing"

# Clear test cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose
```

### **Development Environment Debugging** {#debugging}

#### **Enable Debug Mode**

```bash
# Set debug environment variables
export NODE_ENV=development
export DEBUG=true
export NEXT_PUBLIC_DEBUG=true

# Start with debug logging
npm run dev -- --debug
```

#### **Check System Resources for 3D Development** {#system-resources}

```bash
# Check available memory (3D development needs 8GB+)
free -h | grep "Mem:" || echo "Memory check: Linux command"

# macOS memory check
top -l 1 | grep "PhysMem:" || echo "Memory check: macOS command"

# Check GPU availability (important for 3D rendering)
lspci | grep -i vga || echo "GPU check: Linux command"
system_profiler SPDisplaysDataType | grep "Chipset Model" || echo "GPU check: macOS command"

# Check Node.js memory usage
node --max-old-space-size=4096 -e "console.log('Node.js memory limit set to 4GB')"
```

---

## 📊 **PERFORMANCE MONITORING** {#performance-monitoring}

### **Development Server Performance** {#dev-performance}

```bash
# Measure Next.js startup time
time npm run dev &
sleep 5 && curl -o /dev/null -s -w "Response time: %{time_total}s\n" http://localhost:3000/

# Check build performance
time npm run build
```

### **3D Rendering Performance** {#3d-performance}

```bash
# Monitor 3D scene performance (check browser DevTools)
echo "Monitor 3D performance in Browser DevTools:"
echo "1. Open http://localhost:3000"
echo "2. Press F12 -> Performance tab"
echo "3. Record while interacting with 3D scene"
echo "4. Check for 60 FPS desktop / 30 FPS mobile"

# Check WebGL renderer info
node -e "console.log('Check WebGL info in browser console: renderer.info')"
```

### **Memory Usage Monitoring** {#memory-monitoring}

```bash
# Monitor Node.js memory usage
node -e "const used = process.memoryUsage(); Object.keys(used).forEach(key => console.log(\`\${key}: \${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\`));"

# Check for memory leaks in 3D scenes
echo "Monitor 3D memory usage in browser DevTools -> Memory tab"
echo "Look for increasing heap size during 3D interactions"
```

### **Build Performance Targets** {#performance-targets}

| Metric           | Target                        | Validation                |
| ---------------- | ----------------------------- | ------------------------- |
| Dev Server Start | <10s                          | `time npm run dev`        |
| Type Checking    | <5s                           | `time npm run type-check` |
| Test Suite       | <30s                          | `time npm test`           |
| Build Time       | <60s                          | `time npm run build`      |
| 3D Model Load    | <5s                           | Browser performance tools |
| Frame Rate       | 60 FPS desktop, 30 FPS mobile | Performance monitoring    |

---

## 🔧 **CONFIGURATION** {#configuration}

### **Environment Variables** {#environment-variables}

```bash
# Development environment (.env.local)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true

# Production environment
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
```

### **Next.js Configuration** {#nextjs-config}

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    // 3D model file support
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;
```

### **TypeScript Configuration** {#typescript-config}

```json
// tsconfig.json (key settings)
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🛑 **SHUTDOWN & CLEANUP PROCEDURES** {#shutdown}

### **Graceful Development Server Shutdown**

```bash
# Stop Next.js development server
# Press Ctrl+C in terminal running npm run dev

# Or kill by port
kill $(lsof -ti:3000) 2>/dev/null || echo "No process on port 3000"
```

### **Project Cleanup** {#cleanup}

```bash
# Clean up build artifacts and caches
npm run clean

# Or manually clean specific directories
rm -rf .next
rm -rf coverage
rm -rf node_modules/.cache

# Clean up test artifacts
rm -rf src/__tests__/temp
find . -name "*.tmp" -delete
```

### **Development Reset** {#dev-reset}

```bash
# Complete development environment reset
npm run clean
rm -rf node_modules
npm install
npm run validate
```

---

## 📋 **DEVELOPMENT STARTUP CHECKLIST** {#startup-checklist}

### **Pre-Startup Checklist** {#pre-startup}

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ or yarn 1.22+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Port 3000 available
- [ ] GPU available for 3D development (recommended)
- [ ] Sufficient memory available (8GB+ RAM)
- [ ] Project root directory is current working directory

### **Startup Verification Checklist** {#startup-verification}

- [ ] Next.js development server starts successfully
- [ ] Development server responds on http://localhost:3000
- [ ] TypeScript compilation successful (no errors)
- [ ] 3D scene renders without WebGL errors
- [ ] Hot module replacement working
- [ ] ESLint validation passes
- [ ] Test framework operational (`npm test`)
- [ ] No console errors in browser DevTools

### **TDD Environment Verification** {#tdd-verification-checklist}

- [ ] Jest testing framework operational
- [ ] React Testing Library setup working
- [ ] Test watch mode functional (`npm run test:watch`)
- [ ] Code coverage reporting enabled
- [ ] 3D component testing mocks configured
- [ ] All quality gates passing (`npm run validate`)
- [ ] Pre-commit hooks operational

### **3D Development Verification** {#3d-verification}

- [ ] WebGL support available in browser
- [ ] React Three Fiber components render
- [ ] 3D models load successfully (\*.glb files)
- [ ] Camera controls responsive
- [ ] Frame rate meets targets (60 FPS desktop, 30 FPS mobile)
- [ ] 3D scene performance acceptable
- [ ] Memory usage stable during 3D interactions

---

## 🎯 **DEVELOPMENT BEST PRACTICES** {#best-practices}

### **TDD-First Development Best Practices** {#tdd-practices}

1. **Always write tests first**: Follow RED-GREEN-REFACTOR cycle religiously
2. **Keep test watch mode running**: `npm run test:watch` during development
3. **Use descriptive test names**: Tests should read like specifications
4. **Test 3D components properly**: Use proper mocks for Three.js components
5. **Maintain high coverage**: Target 90%+ test coverage
6. **Quality gates before commits**: `npm run validate` must pass

### **3D Development Best Practices** {#3d-practices}

1. **Monitor performance continuously**: Check frame rates in DevTools
2. **Optimize 3D models**: Keep model file sizes reasonable (<10MB)
3. **Use proper disposal**: Clean up 3D resources to prevent memory leaks
4. **Test across devices**: Verify 3D performance on various hardware
5. **Handle WebGL errors**: Provide fallbacks for unsupported devices
6. **Use performance monitoring**: Track 3D scene performance metrics

### **Development Workflow Best Practices** {#workflow-practices}

1. **Run from project root**: All commands from `auto-customizer/` directory
2. **Use TypeScript strictly**: Enable all strict mode options
3. **Keep development server running**: Utilize hot module replacement
4. **Monitor console output**: Watch for TypeScript and build errors
5. **Regular validation**: Run `npm run validate` frequently
6. **Document phase progress**: Update TODO lists and progress tracking

---

## 📚 **RESOURCES** {#resources}

### **Project Documentation** {#project-docs}

- **[Phase 0 TODO](./Phase_0_TODO_List.md)** - Project setup and scaffolding
- **[Phase 1 TODO](./Phase_1_TODO_List.md)** - Core MVP development
- **[Development Guide](./Development_Guide.md)** - TDD workflow and standards
- **[Testing Guide](./Testing_Guide.md)** - Testing procedures and examples
- **[Project Master Context](./Project_Master_Context.md)** - Architecture overview

### **Technology Resources** {#tech-resources}

- **[Next.js Documentation](https://nextjs.org/docs)** - App Router and API routes
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - 3D rendering in React
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript language guide
- **[Jest Documentation](https://jestjs.io/docs/getting-started)** - Testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)** - Component testing

### **Development Tools** {#dev-tools}

- **Browser DevTools** - 3D performance monitoring and debugging
- **React DevTools** - Component debugging and profiling
- **VS Code Extensions** - ES7+ React/Redux/React-Native snippets, Jest

---

**Document Status**: 🚧 **PHASE 1 DEVELOPMENT**  
**Integration**: Cross-referenced with all Phase TODO lists and development guides  
**Next Update**: Upon Phase 2 advancement with advanced 3D features

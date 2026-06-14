// =================================================================================================

// The /// syntax:  a TypeScript triple-slash directive.
// It's a special kind of comment that let TypeScript to reads and act during compilation.
// it tells TypeScript to load additional type definitions.
// here it adds Vite types to the project so TypeScript recognizes Vite-specific declarations and it 
// enables proper typing for:
// - import.meta.env (environment variables)
// - import.meta.hot (Hot Module Replacement)
// - Asset imports (images, CSS, SVGs, etc.)
// 


/// <reference types="vite/client" />


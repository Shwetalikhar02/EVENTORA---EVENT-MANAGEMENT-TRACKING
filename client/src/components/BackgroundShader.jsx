import React from 'react';

const BackgroundShader = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {/* Ambient Shader Blob 1 - Indigo/Violet */}
            <div className="absolute -top-32 -left-32 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-gradient-to-tr from-indigo-500/30 via-purple-500/25 to-pink-500/20 rounded-full blur-3xl opacity-70 animate-blob-1"></div>

            {/* Ambient Shader Blob 2 - Cyan/Purple */}
            <div className="absolute top-1/3 -right-32 w-96 sm:w-[550px] h-96 sm:h-[550px] bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-indigo-600/25 rounded-full blur-3xl opacity-60 animate-blob-2"></div>

            {/* Ambient Shader Blob 3 - Emerald/Indigo */}
            <div className="absolute -bottom-32 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-gradient-to-tl from-emerald-400/20 via-indigo-500/25 to-purple-600/30 rounded-full blur-3xl opacity-60 animate-blob-3"></div>

            {/* Ambient Light Overlay Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]"></div>
        </div>
    );
};

export default BackgroundShader;

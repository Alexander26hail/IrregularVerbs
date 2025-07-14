// src/js/utils/FullscreenUtils.js

export function toggleFullScreen() {
    const doc = window.document;
    const docEl = document.documentElement;

    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    if (isMobile) {
        // En móviles, usar diferentes métodos
        toggleMobileFullscreen();
    } else {
        // En desktop, usar la API estándar
        toggleDesktopFullscreen();
    }
}

function toggleDesktopFullscreen() {
    const doc = window.document;
    const docEl = document.documentElement;

    const requestFullScreen = docEl.requestFullscreen || 
                              docEl.mozRequestFullScreen || 
                              docEl.webkitRequestFullscreen || 
                              docEl.msRequestFullscreen;
    
    const cancelFullScreen = doc.exitFullscreen || 
                            doc.mozCancelFullScreen || 
                            doc.webkitExitFullscreen || 
                            doc.msExitFullscreen;

    if (!doc.fullscreenElement && 
        !doc.mozFullScreenElement && 
        !doc.webkitFullscreenElement && 
        !doc.msFullscreenElement) {
        
        if (requestFullScreen) {
            requestFullScreen.call(docEl).catch(err => {
                console.log('Error entering fullscreen:', err);
                // Fallback para desktop si falla
                toggleMobileFullscreen();
            });
        }
    } else {
        if (cancelFullScreen) {
            cancelFullScreen.call(doc);
        }
    }
}

function toggleMobileFullscreen() {
    const appContainer = document.getElementById('app-container');
    const body = document.body;
    const html = document.documentElement;
    
    if (!body.classList.contains('mobile-fullscreen')) {
        // Entrar en modo fullscreen móvil
        body.classList.add('mobile-fullscreen');
        
        // Ocultar barras del navegador en móviles
        if (window.screen && window.screen.orientation) {
            // Para Android Chrome
            try {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().catch(() => {
                        // Si falla, aplicar estilos manuales
                        applyMobileFullscreenStyles();
                    });
                } else {
                    applyMobileFullscreenStyles();
                }
            } catch (e) {
                applyMobileFullscreenStyles();
            }
        } else {
            applyMobileFullscreenStyles();
        }
        
        updateFullscreenIcons(true);
    } else {
        // Salir del modo fullscreen móvil
        body.classList.remove('mobile-fullscreen');
        removeMobileFullscreenStyles();
        
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }
        
        updateFullscreenIcons(false);
    }
}

function applyMobileFullscreenStyles() {
    const body = document.body;
    const html = document.documentElement;
    
    // Aplicar estilos para ocultar barras del navegador
    body.style.cssText = `
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        background: #f1f5f9 !important;
    `;
    
    html.style.cssText = `
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
    `;
    
    // Ocultar la barra de direcciones en móviles
    window.scrollTo(0, 1);
    
    // Forzar el viewport
    let viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
}

function removeMobileFullscreenStyles() {
    const body = document.body;
    const html = document.documentElement;
    
    // Remover estilos personalizados
    body.style.cssText = '';
    html.style.cssText = '';
    
    // Restaurar viewport original
    let viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
}

export function updateFullscreenIcons(isFullscreen) {
    const enterIcon = document.getElementById('fullscreen-enter-icon');
    const exitIcon = document.getElementById('fullscreen-exit-icon');
    
    if (isFullscreen) {
        enterIcon.classList.add('hidden');
        exitIcon.classList.remove('hidden');
    } else {
        enterIcon.classList.remove('hidden');
        exitIcon.classList.add('hidden');
    }
}

export function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement);
    
    updateFullscreenIcons(isFullscreen);
    
    // Si salimos del fullscreen del navegador, también salir del modo móvil
    if (!isFullscreen && document.body.classList.contains('mobile-fullscreen')) {
        document.body.classList.remove('mobile-fullscreen');
        removeMobileFullscreenStyles();
    }
}

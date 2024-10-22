 // ==UserScript==
// @name         Diep.io Increase FOV con Teclas (X y Z)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Aumentar campo de visión en Diep.io usando las teclas X y Z para ajustar el zoom
// @author       Nesquik
// @match        *://diep.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let scaleFactor = 1.0;  // Factor de escala inicial
    let fovIncrement = 0.005;  // Incremento del FOV para cada tecla presionada
    let maxScaleFactor = 1.5;  // Límite máximo ajustado para evitar errores
    let minScaleFactor = 0.5;  // Límite mínimo ajustado
    let isTankMoving = false; // Variable para verificar si el tanque está en movimiento
    let timeout; // Variable para el temporizador

    // Función para encontrar el canvas del juego
    function findGameCanvas() {
        let gameCanvas = document.querySelector('canvas');
        if (gameCanvas) return gameCanvas;

        const gameIframe = document.querySelector('iframe');
        if (gameIframe) {
            const iframeContent = gameIframe.contentDocument || gameIframe.contentWindow.document;
            gameCanvas = iframeContent.querySelector('canvas');
            if (gameCanvas) return gameCanvas;
        }

        return null;  // Si no encuentra el canvas, retornar null
    }

    // Función para ajustar la resolución del canvas (campo de visión)
    function adjustResolution(scale) {
        const gameCanvas = findGameCanvas();

        if (gameCanvas) {
            const context = gameCanvas.getContext('2d');
            gameCanvas.width = window.innerWidth * scale;
            gameCanvas.height = window.innerHeight * scale;
            context.scale(scale, scale);

            console.log(`Campo de visión ajustado: ${scale}`);
        } else {
            console.error('Canvas del juego no encontrado');
        }
    }

    // Función para suavizar el ajuste del FOV
    function smoothAdjust(targetScale) {
        if (Math.abs(scaleFactor - targetScale) > 0.01) {
            scaleFactor += (targetScale - scaleFactor) * 0.1; // Ajuste gradual
            adjustResolution(scaleFactor);
            requestAnimationFrame(() => smoothAdjust(targetScale));
        }
    }

    // Listener para detectar las teclas X y Z
    window.addEventListener('keydown', function(event) {
        if (event.key === 'x' || event.key === 'X') {
            scaleFactor += fovIncrement;  // Aumentar FOV (tecla X)
        } else if (event.key === 'z' || event.key === 'Z') {
            scaleFactor -= fovIncrement;  // Disminuir FOV (tecla Z)
        }

        // Limitar el factor de escala
        scaleFactor = Math.min(Math.max(scaleFactor, minScaleFactor), maxScaleFactor); // Limitar el FOV

        // Aplicar ajuste suave después de un breve retraso
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            smoothAdjust(scaleFactor);
        }, 100); // Ajustar después de 100 ms
    });

    // Intervalo para intentar encontrar el canvas del juego repetidamente
    let canvasCheckInterval = setInterval(() => {
        const gameCanvas = findGameCanvas();
        if (gameCanvas) {
            console.log('Canvas del juego encontrado');
            clearInterval(canvasCheckInterval);  // Detener la búsqueda
        } else {
            console.log('Buscando canvas...');
        }
    }, 1000); // Intentar cada segundo

    // Aquí puedes agregar lógica para verificar el movimiento del tanque y actualizar `isTankMoving`
    // Esto puede depender de cómo se maneja el movimiento en el juego.

})();


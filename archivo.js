 // ==UserScript==
// @name         Diep.io Increase FOV (Detección mejorada del canvas y zoom con rueda del ratón)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Aumentar campo de visión en Diep.io con detección mejorada del canvas y zoom con la rueda del ratón
// @author       Nesquik
// @match        *://diep.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let scaleFactor = 1.0;  // Factor de escala inicial

    // Función para encontrar el canvas del juego
    function findGameCanvas() {
        // Intentar buscar el canvas en el documento principal
        let gameCanvas = document.querySelector('canvas');
        if (gameCanvas) {
            return gameCanvas;
        }

        // Si no lo encuentra, buscar dentro del iframe
        const gameIframe = document.querySelector('iframe');
        if (gameIframe) {
            const iframeContent = gameIframe.contentDocument || gameIframe.contentWindow.document;
            gameCanvas = iframeContent.querySelector('canvas');
            if (gameCanvas) {
                return gameCanvas;
            }
        }

        return null;  // Si no encuentra el canvas, retornar null
    }

    // Función para ajustar la resolución del canvas (campo de visión)
    function adjustResolution(scale) {
        const gameCanvas = findGameCanvas();

        if (gameCanvas) {
            // Cambiar la resolución del canvas
            const context = gameCanvas.getContext('2d');
            gameCanvas.width = window.innerWidth * scale;
            gameCanvas.height = window.innerHeight * scale;
            context.scale(scale, scale);

            console.log(`Campo de visión ajustado: ${scale}`);
        } else {
            console.error('Canvas del juego no encontrado');
        }
    }

    // Listener para detectar el uso de la rueda del ratón
    window.addEventListener('wheel', function(event) {
        if (event.deltaY < 0) {
            scaleFactor += 0.01;  // Alejar (scroll hacia arriba)
        } else if (event.deltaY > 0) {
            scaleFactor -= 0.01;  // Acercar (scroll hacia abajo)
        }

        // Limitar el factor de escala
        if (scaleFactor < 0.5) scaleFactor = 0.5;  // Mínimo
        if (scaleFactor > 2.0) scaleFactor = 2.0;  // Máximo

        adjustResolution(scaleFactor);
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

})();


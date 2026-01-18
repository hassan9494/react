// src/hooks/usePrintStyles.js
import { useEffect } from 'react'

export const usePrintStyles = (orderNumber) => {
    useEffect(() => {
        const styleId = 'dynamic-print-styles'
        let styleElement = document.getElementById(styleId)

        if (!styleElement) {
            styleElement = document.createElement('style')
            styleElement.id = styleId
            styleElement.setAttribute('media', 'print')
            document.head.appendChild(styleElement)
        }

        // Create the print styles with the actual order number
        const printStyles = `
            @page {
                @bottom-left {
                    content: "${orderNumber || 'N/A'}";
                    font-size: 12px;
                    color: #000;
                    font-family: 'Times New Roman', Times, serif;
                    margin-left: 20mm; 

                }
                
                @bottom-center {
                    content: "Page " counter(page) " of " counter(pages);
                    font-size: 12px;
                    color: #000;
                    font-family: 'Times New Roman', Times, serif;
                }
            }
        `

        styleElement.textContent = printStyles

        return () => {
            // Cleanup
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement)
            }
        }
    }, [orderNumber])
}
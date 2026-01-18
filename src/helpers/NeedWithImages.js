import { jsonToExcel } from './ExcelHelper'

export const needsToExcelWithImages = (needs, fileName) => {
    const { REACT_APP_WEBSITE } = process.env
    try {
        // Create HTML table with perfectly sized and centered images
        let html = `
            <html xmlns:v="urn:schemas-microsoft-com:vml"
                  xmlns:o="urn:schemas-microsoft-com:office:office"
                  xmlns:x="urn:schemas-microsoft-com:office:excel"
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <title>${fileName || 'Products Export'}</title>
                <style>
                    v\:* { behavior: url(#default#VML); }
                    o\:* { behavior: url(#default#VML); }
                    x\:* { behavior: url(#default#VML); }
                    .shape { behavior: url(#default#VML); }
                    body { font-family: Arial, sans-serif; font-size: 12px; }
                </style>
                <!--[if gte mso 9]>
                <xml>
                    <o:OfficeDocumentSettings>
                        <o:AllowPNG/>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
            </head>
            <body>
            <table border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <colgroup>
                    <col width="40">  <!-- ID -->
                    <col width="60">  <!-- Image (60px to allow padding) -->
                    <col width="250"> <!-- Name -->
                    <col width="50">  <!-- Stock -->
                    <col width="60">  <!-- Price -->
                    <col width="60">  <!-- Real Price -->
                    <col width="60">  <!-- Min Qty -->
                    <col width="70">  <!-- Order Qty -->
                    <col width="80">  <!-- Purchases Qty -->
                    <col width="70">  <!-- Price All -->
                    <col width="80">  <!-- Real Price All -->
                    <col width="100"> <!-- Source SKU -->
                    <col width="300"> <!-- Link -->
                    <col width="100"> <!-- Source -->
                </colgroup>
                <thead>
                    <tr>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">ID</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px; width: 60px;">Image</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Name</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Stock</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Price</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Real Price</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Min Qty</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Order Qty</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Purchases Qty</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Price All</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Real Price All</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Source SKU</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Link</th>
                        <th style="background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px;">Source</th>
                    </tr>
                </thead>
                <tbody>
        `

        // Add rows with perfectly centered 50x50 images
        needs.forEach(product => {
            // Create unique ID for each image
            const imageId = `img-${product.id}-${Date.now()}`

            html += `
                <tr style="height: 60px;">  <!-- Row height for image cell -->
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.id}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 0; width: 60px; height: 60px;">
            `

            if (product.image) {
                html += `
                    <!--[if gte vml 1]>
                    <v:shape id="${imageId}"
                              xmlns:v="urn:schemas-microsoft-com:vml"
                              style="width:50px;height:50px;visibility:visible;z-index:0;mso-wrap-style:square;margin:5px auto;"
                              stroked="f">
                        <v:imagedata src="${product.image}" o:title="Product Image"/>
                        <v:path o:extrusionok="f"/>
                    </v:shape>
                    <![endif]-->
                    <!-- Fallback for non-Excel viewers -->
                    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                        <img src="${product.image}" width="50" height="50" style="display: block; margin: 0 auto;" />
                    </div>
                `
            } else {
                html += '<div style="text-align: center; line-height: 60px;">No image</div>'
            }

            html += `
                    </td>
                    <td style="vertical-align: middle; padding: 5px;">${product.name}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.stock}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.price}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.real_price}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.min_qty}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.order_qty}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.purchases_qty}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.priceAll}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.allRealPrice}</td>
                    <td style="text-align: center; vertical-align: middle; padding: 5px;">${product.source_sku}</td>
                    <td style="vertical-align: middle; padding: 5px;">
                        <a href="${REACT_APP_WEBSITE}/product/${product.sku}">${REACT_APP_WEBSITE}/product/${product.sku}</a>
                    </td>
                    <td style="vertical-align: middle; padding: 5px;">${product.source || ''}</td>
                </tr>
            `
        })

        html += `</tbody></table></body></html>`

        // Create and trigger download
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${fileName || 'products-export'}.xls`
        document.body.appendChild(link)
        link.click()

        // Clean up
        setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }, 100)

    } catch (error) {
        console.error('Export failed:', error)
        // Fallback to basic Excel export if HTML fails
        const simpleData = needs.map(product => ({
            Id: product.id,
            Name: product.name,
            Stock: product.stock,
            Price: product.price,
            Real_Price: product.real_price,
            Min_Quantity: product.min_qty,
            Order_Quantity: product.order_qty,
            Purchases_Quantity: product.purchases_qty,
            PriceAll: product.priceAll,
            Real_Price_All: product.allRealPrice,
            Source_Sku: product.source_sku,
            Link: product.link,
            Source: product.source,
            Image_URL: product.image || 'No image'
        }))
        jsonToExcel(simpleData, fileName || 'products-report-fallback')
    }
}
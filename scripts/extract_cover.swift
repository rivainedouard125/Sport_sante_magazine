import Foundation
import PDFKit
import AppKit

func extractFirstPage(from pdfPath: String, to outPath: String) {
    let pdfURL = URL(fileURLWithPath: pdfPath)
    guard let document = PDFDocument(url: pdfURL) else {
        print("Error: Could not open PDF at \(pdfPath)")
        return
    }
    
    guard let page = document.page(at: 0) else {
        print("Error: Could not get first page from \(pdfPath)")
        return
    }
    
    let pageRect = page.bounds(for: .mediaBox)
    let image = NSImage(size: pageRect.size)
    
    image.lockFocus()
    if let context = NSGraphicsContext.current?.cgContext {
        context.setFillColor(NSColor.white.cgColor)
        context.fill(pageRect)
        page.draw(with: .mediaBox, to: context)
    }
    image.unlockFocus()
    
    guard let tiffData = image.tiffRepresentation,
          let bitmapRep = NSBitmapImageRep(data: tiffData),
          let jpegData = bitmapRep.representation(using: .jpeg, properties: [:]) else {
        print("Error: Could not create JPEG for \(pdfPath)")
        return
    }
    
    do {
        try jpegData.write(to: URL(fileURLWithPath: outPath))
        print("Success: \(outPath)")
    } catch {
        print("Error: Could not write JPEG to \(outPath): \(error)")
    }
}

let args = ProcessInfo.processInfo.arguments
if args.count < 3 {
    print("Usage: swift extract_cover.swift <input.pdf> <output.jpg>")
    exit(1)
}

extractFirstPage(from: args[1], to: args[2])

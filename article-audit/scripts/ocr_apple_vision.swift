import AppKit
import Foundation
import Vision

func collectImageFiles(from arguments: [String]) -> [URL] {
    var files: [URL] = []
    let fileManager = FileManager.default

    for arg in arguments {
        let url = URL(fileURLWithPath: NSString(string: arg).expandingTildeInPath)
        var isDir: ObjCBool = false
        if fileManager.fileExists(atPath: url.path, isDirectory: &isDir) {
            if isDir.boolValue {
                let children = (try? fileManager.contentsOfDirectory(at: url, includingPropertiesForKeys: nil)) ?? []
                files.append(contentsOf: children.filter { ["png", "jpg", "jpeg", "gif", "webp"].contains($0.pathExtension.lowercased()) })
            } else {
                files.append(url)
            }
        }
    }

    return files.sorted { $0.lastPathComponent < $1.lastPathComponent }
}

func recognizedText(for imageURL: URL) throws -> [String] {
    guard let image = NSImage(contentsOf: imageURL) else { return [] }
    var rect = CGRect(origin: .zero, size: image.size)
    guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else { return [] }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["zh-Hans", "en-US"]

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try handler.perform([request])

    let results = request.results ?? []
    return results.compactMap { $0.topCandidates(1).first?.string }
}

let args = Array(CommandLine.arguments.dropFirst())
if args.isEmpty {
    fputs("Usage: swift ocr_apple_vision.swift <image-or-dir> [more paths...]\n", stderr)
    exit(1)
}

for file in collectImageFiles(from: args) {
    print("===== \(file.lastPathComponent) =====")
    do {
        let lines = try recognizedText(for: file)
        if lines.isEmpty {
            print("(no text detected)")
        } else {
            for line in lines {
                print(line)
            }
        }
    } catch {
        print("(ocr failed: \(error))")
    }
    print("")
}

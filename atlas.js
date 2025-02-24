import sharp from 'sharp';
import { OUTPUT_DIR, ATLAS_SIZE, DEFAULT_IMAGE, FIXED_SIGNAGES } from './const.js';
import fs from 'fs/promises';
import * as path from "path";

const IMAGE_SIZE = ATLAS_SIZE / 2;

// スライドショーの画像を処理する関数
async function createSlideshowAtlas(dir) {
    try {
        await fs.mkdir(path.join(OUTPUT_DIR, dir), { recursive: true });
        const slides = await fs.readdir(path.join(dir,'A'));
        const slideNumbers = [...new Set(slides.map(slide => slide.match(/slide(\d+)/)[1]))];

        await Promise.all(slideNumbers.map(async (slideNumber) => {
            const images = [];
            const imagePaths = [
                path.join(dir, 'A', `slide${slideNumber}.png`),
                path.join(dir, 'B', `slide${slideNumber}.png`),
                path.join(dir, 'C', `slide${slideNumber}.png`),
                path.join(dir, 'D', `slide${slideNumber}.png`)
            ];

            for (const imagePath of imagePaths) {
                try {
                    await fs.access(imagePath);
                    images.push(imagePath);
                } catch (err) {
                    // ファイルが存在しない場合は何もしない
                }
            }
            const outputPath = path.join(OUTPUT_DIR, dir, `slide${slideNumber}.png`);
            console.log(images, outputPath);
            await createAtlas(images, outputPath);
        }));
    } catch (error) {
        console.error(`Error creating slideshow atlas for ${dir}:`, error);
    }
}

// 固定掲示の画像を処理する関数
async function createFixedAtlas(signage) {
    try {
        const outputPath = path.join(OUTPUT_DIR, 'fixed', signage.name)
        console.log(signage.images, outputPath);
        await createAtlas(signage.images, outputPath);
    } catch (error) {
        console.error(`Error creating fixed atlas for ${signage.name}:`, error);
    }
}

async function createAtlas(images, outputPath) {
    try{
        // 画像をリサイズして正方形に並べる
        const resizedImages = await Promise.all(images.map(image =>
            sharp(`${image}`)
                .resize(IMAGE_SIZE, IMAGE_SIZE, {
                    fit: 'fill',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toBuffer()
        ));

        if(resizedImages.length < 4) {
            const defaultImage = await sharp(DEFAULT_IMAGE)
                .resize(IMAGE_SIZE, IMAGE_SIZE, {
                    fit: 'fill',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toBuffer();
            for (let i = resizedImages.length; i < 4; i++) {
                resizedImages.push(defaultImage);
            }
        }

        // 2x2の画像を生成
        const atlas = await sharp({
            create: {
                width: ATLAS_SIZE,
                height: ATLAS_SIZE,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .composite([
                { input: resizedImages[0], top: 0, left: 0 },
                { input: resizedImages[1], top: 0, left: IMAGE_SIZE },
                { input: resizedImages[2], top: IMAGE_SIZE, left: 0 },
                { input: resizedImages[3], top: IMAGE_SIZE, left: IMAGE_SIZE }
            ])
            .toFile(outputPath);

        console.log(`Atlas for ${outputPath} created successfully!`);
    } catch (error) {
        console.error(`Error creating atlas:`, error);
    }
}

(async () => {
    // スライドショーのディレクトリを自動で取得
    const slideshowDir = 'slideshow';
    const slideshowDirs = (await fs.readdir(slideshowDir, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => `${slideshowDir}/${dirent.name}`);

    // スライドショーの画像を処理
    await Promise.all(slideshowDirs.map(dir => createSlideshowAtlas(dir)));

    // 固定掲示の画像を処理
    await fs.mkdir(path.join(OUTPUT_DIR, 'fixed'), { recursive: true });
    await Promise.all(FIXED_SIGNAGES.map(signage => createFixedAtlas(signage)));
})();
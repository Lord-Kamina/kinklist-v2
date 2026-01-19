import { ExKinkCategory, InKinkCategory, ExKink } from "@/types/kinks";
import { Rating } from "@/types/ratings";
import { APP_VERSION } from "@/version";

const config = {
    numCols: 6,
    categoryWidth: 550,
    titleWithoutSubcategoryHeight: 70,
    titleWithSubcategoryHeight: 100,
    categoryRowHeight: 50,
    offsetTop: 100,
    offsetLeft: 20,
    offsetRight: 20,
    offsetBottom: 20,
    legendItemWidth: 280,
    legendOffset: 50,
} as const;

const stripIds = (data: InKinkCategory[]): ExKinkCategory[] => {
    return data.map((inCat): ExKinkCategory => ({
        name: inCat.name,
        subcategories: inCat.subcategories.slice(),
        kinks: inCat.kinks.map((inKink): ExKink => ({
            name: inKink.name,
            ratings: { ...inKink.ratings },
            comment: inKink.comment,
        })),
    }));
};

export const generateKinklistImage = (inCategories: InKinkCategory[], ratings: Rating[], username: string, encodeData: boolean): HTMLCanvasElement => {
    const exCategories = stripIds(inCategories);
    const dataPixels = getDataPixels(username, exCategories, ratings);
    const { columns, tallestColumnHeight } = divideCategoryColumns(exCategories);
    const { canvasWidth, canvasHeight } = getCanvasDimensions(tallestColumnHeight, dataPixels.length);
    const { canvas, context } = createCanvas(canvasWidth, canvasHeight);

    addUsernameToCanvas(context, username);
    drawLegend(context, ratings, canvasWidth);
    drawAllColumns(context, columns, ratings, encodeData);
    if (encodeData) {
        encodeDataInImage(context, canvasWidth, canvasHeight, dataPixels);
    }

    return canvas;
};

const getCanvasDimensions = (tallestColumnHeight: number, numDataPixels: number): { canvasWidth: number, canvasHeight: number } => {
    const canvasWidth = config.offsetLeft + (config.numCols * config.categoryWidth) + config.offsetRight;
    const canvasHeight = config.offsetTop + tallestColumnHeight + config.offsetBottom + Math.ceil(numDataPixels / canvasWidth);
    return {
        canvasWidth,
        canvasHeight,
    }
}

const drawAllColumns = (context: CanvasRenderingContext2D, columns: ExKinkCategory[][], ratings: Rating[], includeComments: boolean): void => {
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const xOffset = config.offsetLeft + (config.categoryWidth * i);
        let yOffset = config.offsetTop;
        for (const cat of column) {
            const catHeight = calculateCategoryHeight(cat);
            drawCategory(context, xOffset, yOffset, cat, ratings, includeComments);
            yOffset += catHeight;
        }
    }
}

function getCSSprop(cssVarName : string, fromElement? : Element) {
  const element = fromElement || document.body;
  return window.getComputedStyle(element)
         .getPropertyValue(cssVarName);
}

const createCanvas = (width: number, height: number): { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D } => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.fillStyle = getCSSprop('--background-color');
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    return { context: context, canvas: canvas };
};

const addUsernameToCanvas = (context: CanvasRenderingContext2D, username: string): void => {
    context.font = "bold 48px Arial";
    context.fillStyle = getCSSprop('--text-color');
    context.fillText(`Kinklist (v${APP_VERSION})` + username, 10, 50);
}

const divideCategoryColumns = (categories: ExKinkCategory[]): { columns: ExKinkCategory[][], tallestColumnHeight: number } => {
    const totalHeight = categories.reduce((sum: number, cat): number => sum + calculateCategoryHeight(cat), 0);
    const columns: ExKinkCategory[][] = new Array(config.numCols).fill([]).map(() => []);
    let colIndex = 0;
    let colHeight = 0;
    let tallestColumnHeight = 0;
    for (const cat of categories) {
        const catHeight = calculateCategoryHeight(cat);
        if ((colHeight + (catHeight / 2)) > (totalHeight / config.numCols)){
            if ((colIndex + 1) < config.numCols) {
                colIndex++;
                colHeight = 0;
            }
        }
        colHeight += catHeight;
        columns[colIndex].push(cat);
        tallestColumnHeight = Math.max(tallestColumnHeight, colHeight);
    }
    return { columns, tallestColumnHeight };
}

const calculateCategoryHeight = (category: ExKinkCategory): number => {
    const titleHeight = category.subcategories.length > 1
        ? config.titleWithSubcategoryHeight
        : config.titleWithoutSubcategoryHeight;

    return titleHeight + (category.kinks.length * config.categoryRowHeight);
};

const drawCategory = (context: CanvasRenderingContext2D, x: number, y: number, category: ExKinkCategory, ratings: Rating[], includeComments: boolean): void => {
    // Draw title
    context.fillStyle = getCSSprop('--text-color');
    context.font = 'bold 36px Arial';
    context.fillText(category.name, x, y + 10);

    // Optional subcategories
    const hasSubtitle = category.subcategories.length > 1;
    if (hasSubtitle) {
        context.font = 'italic 24px Arial';
        context.fillText(category.subcategories.join(', '), x, y + 50);
    }

    // Row
    for (let i = 0; i < category.kinks.length; i++) {
        const kink = category.kinks[i];
        const rowY = y + (hasSubtitle ? config.titleWithSubcategoryHeight : config.titleWithoutSubcategoryHeight) + (i * config.categoryRowHeight)
        // Text
        context.fillStyle = getCSSprop('--text-color');
        context.font = '24px Arial';
        context.fillText(
            kink.name,
            x + 10 + (category.subcategories.length *  50),
            rowY - 6,
        );
        // Circles
        for (let n = 0; n < category.subcategories.length; n++) {
            const subcategory = category.subcategories[n];
            const rating = ratings.find((r) => r.name === kink.ratings[subcategory]) as Rating;
            const cx = x + 20 + (n * 40);
            const cy = rowY - 20;

            context.beginPath();
            context.arc(cx, cy, 16, 0, 2 * Math.PI, false);
            const domElement = document.querySelectorAll(
                'dl .rating dt span')[ratings.indexOf(rating)];
            const fillColor = getCSSprop('background-color', domElement);
            context.fillStyle = fillColor;
            context.fill();
            context.strokeStyle = getCSSprop('--border-color');
            context.lineWidth = 2;
            context.stroke();
        }
        // Comment
        if (includeComments && kink.comment) {
            const textWidth = context.measureText(kink.name).width;
            const commentXOffset = x + 40 + (category.subcategories.length *  40) + textWidth;
            context.beginPath();
            context.ellipse(commentXOffset, rowY - 20, 12, 10, 0, 0.4 * Math.PI, 0.1 * Math.PI, false);
            context.lineTo(commentXOffset, rowY - 4);
            context.lineTo(commentXOffset, rowY - 10);
            context.fillStyle = getCSSprop('--background-color');
            context.fill();
            context.strokeStyle = getCSSprop('--border-color');
            context.lineWidth = 2;
            context.stroke();
            context.beginPath();
            context.moveTo(commentXOffset - 3, rowY - 23);
            context.lineTo(commentXOffset + 1, rowY - 23);
            context.moveTo(commentXOffset - 3, rowY - 17);
            context.lineTo(commentXOffset + 3, rowY - 17);
            context.fillStyle = getCSSprop('--background-color');
            context.fill();
            context.strokeStyle = getCSSprop('--border-color');
            context.lineWidth = 2;
            context.stroke();
        }
    }
};

const drawLegend = (context: CanvasRenderingContext2D, ratings: Rating[], canvasWidth: number): void => {
    context.font = "bold 26px Arial";
    context.fillStyle = getCSSprop('--text-color');
    
    let x = canvasWidth - config.legendOffset - (config.legendItemWidth * ratings.length);
    for (const rating of ratings) {
        context.beginPath();
        context.arc(x, 34, 16, 0, 2 * Math.PI, false);
        const domElement = document.querySelectorAll(
            'dl .rating dt span')[ratings.indexOf(rating)];
        const fillColor = getCSSprop('background-color', domElement);
        context.fillStyle = fillColor;
        context.fill();
        context.strokeStyle = getCSSprop('--border-color');
        context.lineWidth = 2;
        context.stroke();
        
        context.fillStyle = getCSSprop('--text-color');
        context.fillText(rating.name, x + 30, 44);
        x += config.legendItemWidth;
    }
};

type DataPixel = { r: number, g: number, b: number };
const getDataPixels = (username: string, categories: ExKinkCategory[], ratings: Rating[]): DataPixel[] => {
    const data = JSON.stringify({ username, categories, ratings });
    const bytes = [...data].map((c) => c.charCodeAt(0));
    const pixels = bytes.map((n) => {
        return {
            r: 254 - (n & 0b00000111),
            g: 254 - ((n & 0b00111000) >> 3),
            b: 254 - ((n & 0b11000000) >> 6),
        };
    });
    return pixels;
}

const encodeDataInImage = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, pixels: DataPixel[]): void => {
    // draw the pixels
    let x = 0;
    let y = canvasHeight - 1;
    for (const pixel of pixels) {
        context.beginPath();
        context.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        context.fillRect(x, y, 1, 1);
        context.fill();

        x++;
        if (x >= canvasWidth) {
            x = 0;
            y--;
        }
    }

};

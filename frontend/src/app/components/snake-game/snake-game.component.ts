import { Component, ElementRef, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-snake-game',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="game-container">
            <div class="game-score">Score: {{ score }}</div>
            <canvas #gameCanvas class="game-canvas" width="800" height="200"></canvas>
            <div class="game-controls">
                <button class="game-button" (click)="startGame()" [disabled]="isPlaying">Start</button>
                <button class="game-button" (click)="pauseGame()" [disabled]="!isPlaying">Pause</button>
            </div>
        </div>
    `
})
export class SnakeGameComponent implements OnInit, OnDestroy {
    @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D;
    private snake: { x: number; y: number }[] = [];
    private food: { x: number; y: number } = { x: 0, y: 0 };
    private direction: 'up' | 'down' | 'left' | 'right' = 'right';
    private gameInterval: any;
    private readonly gridSize = 20;
    private readonly speed = 200;
    
    score = 0;
    isPlaying = false;

    ngOnInit() {
        this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
        this.initializeGame();
    }

    ngOnDestroy() {
        this.pauseGame();
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            // Prevent default scrolling behavior
            event.preventDefault();
            
            switch (event.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.direction = 'right';
                    break;
            }
        }
    }

    private initializeGame() {
        // Initialize snake in the middle
        const startX = Math.floor(this.canvasRef.nativeElement.width / (2 * this.gridSize)) * this.gridSize;
        const startY = Math.floor(this.canvasRef.nativeElement.height / (2 * this.gridSize)) * this.gridSize;
        this.snake = [{ x: startX, y: startY }];
        this.generateFood();
        this.score = 0;
        this.direction = 'right';
        this.draw();
    }

    startGame() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.gameInterval = setInterval(() => this.gameLoop(), this.speed);
    }

    pauseGame() {
        this.isPlaying = false;
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
    }

    private gameLoop() {
        const head = { ...this.snake[0] };

        // Move snake
        switch (this.direction) {
            case 'up': head.y -= this.gridSize; break;
            case 'down': head.y += this.gridSize; break;
            case 'left': head.x -= this.gridSize; break;
            case 'right': head.x += this.gridSize; break;
        }

        // Check wall collision
        if (
            head.x < 0 || 
            head.x >= this.canvasRef.nativeElement.width || 
            head.y < 0 || 
            head.y >= this.canvasRef.nativeElement.height
        ) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    private generateFood() {
        const maxX = Math.floor(this.canvasRef.nativeElement.width / this.gridSize);
        const maxY = Math.floor(this.canvasRef.nativeElement.height / this.gridSize);
        
        do {
            this.food = {
                x: Math.floor(Math.random() * maxX) * this.gridSize,
                y: Math.floor(Math.random() * maxY) * this.gridSize
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    private draw() {
        // Clear canvas
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

        // Draw grid (optional)
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x < this.canvasRef.nativeElement.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasRef.nativeElement.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvasRef.nativeElement.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasRef.nativeElement.width, y);
            this.ctx.stroke();
        }

        // Draw snake
        this.ctx.fillStyle = '#0052cc';
        this.snake.forEach((segment, index) => {
            // Draw snake body with rounded corners
            this.ctx.beginPath();
            this.ctx.roundRect(
                segment.x, 
                segment.y, 
                this.gridSize - 1, 
                this.gridSize - 1,
                index === 0 ? 8 : 4 // Head has larger radius
            );
            this.ctx.fill();

            // Add eyes to the head
            if (index === 0) {
                this.ctx.fillStyle = '#fff';
                const eyeSize = 4;
                const eyeOffset = 5;
                
                // Position eyes based on direction
                let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
                switch (this.direction) {
                    case 'right':
                        leftEyeX = segment.x + this.gridSize - eyeOffset;
                        leftEyeY = segment.y + eyeOffset;
                        rightEyeX = segment.x + this.gridSize - eyeOffset;
                        rightEyeY = segment.y + this.gridSize - eyeOffset * 2;
                        break;
                    case 'left':
                        leftEyeX = segment.x + eyeOffset;
                        leftEyeY = segment.y + eyeOffset;
                        rightEyeX = segment.x + eyeOffset;
                        rightEyeY = segment.y + this.gridSize - eyeOffset * 2;
                        break;
                    case 'up':
                        leftEyeX = segment.x + eyeOffset;
                        leftEyeY = segment.y + eyeOffset;
                        rightEyeX = segment.x + this.gridSize - eyeOffset * 2;
                        rightEyeY = segment.y + eyeOffset;
                        break;
                    case 'down':
                        leftEyeX = segment.x + eyeOffset;
                        leftEyeY = segment.y + this.gridSize - eyeOffset;
                        rightEyeX = segment.x + this.gridSize - eyeOffset * 2;
                        rightEyeY = segment.y + this.gridSize - eyeOffset;
                        break;
                }
                
                this.ctx.beginPath();
                this.ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
                this.ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // Draw food
        this.ctx.fillStyle = '#ff5630';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x + this.gridSize / 2,
            this.food.y + this.gridSize / 2,
            this.gridSize / 2 - 1,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    private gameOver() {
        this.pauseGame();
        this.initializeGame();
    }
} 
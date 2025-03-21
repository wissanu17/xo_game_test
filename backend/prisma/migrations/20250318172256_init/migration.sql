-- CreateTable
CREATE TABLE `Game` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gameType` VARCHAR(191) NOT NULL,
    `boardSize` INTEGER NOT NULL DEFAULT 3,
    `winner` VARCHAR(191) NULL,
    `player1Name` VARCHAR(191) NOT NULL DEFAULT 'Player 1',
    `player2Name` VARCHAR(191) NOT NULL DEFAULT 'Computer',

    INDEX `Game_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Move` (
    `id` VARCHAR(191) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `moveOrder` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Move_gameId_moveOrder_idx`(`gameId`, `moveOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Move` ADD CONSTRAINT `Move_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

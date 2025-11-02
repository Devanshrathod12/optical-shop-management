// backupService.js - PERMANENT Backup Solution (NEVER DELETES ANY BACKUP)
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cron = require('node-cron'); // npm install node-cron

// Import your models
const Customer = require('../models/customer');
const Sales = require('../models/Sales');
const Wholesaler = require('../models/Wholesaler');

class BackupService {
  constructor() {
    // Main backup directory - ALL backups stored here PERMANENTLY
    this.backupDir = path.join(__dirname, 'backups');
    this.allBackupsDir = path.join(this.backupDir, 'all_backups'); // NEVER DELETED
    
    // Organize by year and month for easy navigation
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    
    this.initializeBackupDirectories();
  }

  // Initialize backup directories
  initializeBackupDirectories() {
    const dirs = [
      this.backupDir,
      this.allBackupsDir
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });
  }

  // Get current year-month folder path
  getCurrentBackupPath() {
    const yearMonthPath = path.join(
      this.allBackupsDir,
      `${this.currentYear}`,
      `${this.currentMonth}-${this.getMonthName()}`
    );
    
    if (!fs.existsSync(yearMonthPath)) {
      fs.mkdirSync(yearMonthPath, { recursive: true });
    }
    
    return yearMonthPath;
  }

  // Get month name
  getMonthName() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(this.currentMonth) - 1];
  }

  // Generate filename with detailed timestamp
  generateFileName(collectionName, type = 'auto') {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const timestamp = Date.now(); // Unique timestamp
    return `${collectionName}_${type}_${date}_${time}_${timestamp}.json`;
  }

  // Backup single collection with COMPLETE DATA
  async backupCollection(Model, collectionName, backupType = 'auto') {
    try {
      console.log(`📦 Backing up ${collectionName}...`);
      
      // ⭐ Fetch ALL data (including your 10 months old data + new data)
      const data = await Model.find({}).lean();
      
      // Calculate data statistics
      const allDates = data
        .map(d => new Date(d.date || d.createdAt || Date.now()))
        .filter(d => !isNaN(d.getTime()));
      
      const oldestDate = allDates.length > 0 
        ? new Date(Math.min(...allDates.map(d => d.getTime()))) 
        : null;
      const newestDate = allDates.length > 0 
        ? new Date(Math.max(...allDates.map(d => d.getTime()))) 
        : null;
      const totalDays = oldestDate && newestDate
        ? Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Create comprehensive backup object
      const backup = {
        collectionName: collectionName,
        backupDate: new Date().toISOString(),
        backupType: backupType,
        totalRecords: data.length,
        
        // Data range information
        dataRange: {
          oldestRecord: oldestDate,
          newestRecord: newestDate,
          totalDays: totalDays,
          approximateMonths: Math.floor(totalDays / 30),
          approximateYears: (totalDays / 365).toFixed(1)
        },
        
        // Complete data - ALL RECORDS
        data: data,
        
        // Schema for reference
        mongooseSchema: Model.schema.obj,
        
        // Metadata
        metadata: {
          shopName: 'Your Optical Shop',
          backupVersion: '3.0',
          description: `Complete ${collectionName} backup - ALL historical data included`,
          storagePolicy: 'PERMANENT - This backup will NEVER be deleted automatically',
          fileSize: JSON.stringify(data).length,
          backupNumber: Date.now()
        }
      };

      // Get current year-month path
      const backupPath = this.getCurrentBackupPath();
      
      // Generate unique filename
      const fileName = this.generateFileName(collectionName, backupType);
      const filePath = path.join(backupPath, fileName);
      
      // Write backup to file
      fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));
      
      // Log success
      console.log(`✅ ${collectionName} backed up successfully!`);
      console.log(`   📊 Total Records: ${data.length}`);
      console.log(`   📅 Data Range: ${totalDays} days (~${Math.floor(totalDays/30)} months)`);
      console.log(`   📁 Location: ${filePath}`);
      console.log(`   💾 File Size: ${(backup.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   🔒 Storage: PERMANENT (never deleted)\n`);
      
      return {
        success: true,
        collectionName,
        recordCount: data.length,
        filePath,
        fileSize: backup.metadata.fileSize,
        dataRange: backup.dataRange
      };
      
    } catch (error) {
      console.error(`❌ Error backing up ${collectionName}:`, error);
      return {
        success: false,
        collectionName,
        error: error.message
      };
    }
  }

  // Backup ALL collections with COMPLETE DATA
  async backupAllCollections(type = 'auto') {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  🚀 STARTING COMPLETE DATABASE BACKUP (ALL DATA)          ║');
    console.log('║  🔒 Storage: PERMANENT - Never Auto-Deleted               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const collections = [
      { model: Customer, name: 'customers' },
      { model: Sales, name: 'sales' },
      { model: Wholesaler, name: 'wholesalers' }
    ];

    const results = [];
    let totalRecords = 0;
    let totalSize = 0;

    // Backup each collection
    for (const collection of collections) {
      const result = await this.backupCollection(
        collection.model,
        collection.name,
        type
      );
      results.push(result);
      
      if (result.success) {
        totalRecords += result.recordCount;
        totalSize += result.fileSize || 0;
      }
    }

    // Create backup summary
    const backupPath = this.getCurrentBackupPath();
    const summary = {
      backupType: type,
      backupDate: new Date().toISOString(),
      backupLocation: backupPath,
      
      statistics: {
        totalCollections: collections.length,
        successfulBackups: results.filter(r => r.success).length,
        failedBackups: results.filter(r => !r.success).length,
        totalRecords: totalRecords,
        totalSizeBytes: totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
      },
      
      results: results,
      
      storagePolicy: {
        policy: 'PERMANENT STORAGE',
        autoDelete: 'NEVER',
        retention: 'INFINITE',
        note: 'All backups are stored permanently like Git repository. Manual deletion only.'
      }
    };

    // Save summary file
    const summaryPath = path.join(
      backupPath,
      `_BACKUP_SUMMARY_${Date.now()}.json`
    );
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    // Print summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ BACKUP COMPLETED SUCCESSFULLY!                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n📊 Summary:`);
    console.log(`   • Total Records Backed Up: ${totalRecords}`);
    console.log(`   • Total Backup Size: ${summary.statistics.totalSizeMB} MB`);
    console.log(`   • Successful Backups: ${summary.statistics.successfulBackups}/${collections.length}`);
    console.log(`\n📁 Backup Location:`);
    console.log(`   ${backupPath}`);
    console.log(`\n🔒 Storage Policy:`);
    console.log(`   • Retention: INFINITE (like Git repository)`);
    console.log(`   • Auto-Delete: NEVER`);
    console.log(`   • Manual Delete: User's choice only`);
    console.log('');

    return summary;
  }

  // Setup automatic backup schedules (NO AUTO-DELETE)
  setupAutomaticBackups() {
    console.log('\n⏰ Setting up automatic backup schedules...\n');

    // Daily backup at 2:00 AM - COMPLETE DATA, NEVER DELETED
    cron.schedule('0 2 * * *', async () => {
      console.log('\n🕐 Scheduled Daily Backup Starting...');
      await this.backupAllCollections('daily');
    });

    // Weekly backup on Sunday at 3:00 AM
    cron.schedule('0 3 * * 0', async () => {
      console.log('\n📅 Scheduled Weekly Backup Starting...');
      await this.backupAllCollections('weekly');
    });

    // Monthly backup on 1st at 4:00 AM
    cron.schedule('0 4 1 * *', async () => {
      console.log('\n📆 Scheduled Monthly Backup Starting...');
      await this.backupAllCollections('monthly');
    });

    console.log('✅ Automatic Backup Schedules Configured:');
    console.log('   📅 Daily:   Every day at 2:00 AM');
    console.log('   📅 Weekly:  Every Sunday at 3:00 AM');
    console.log('   📅 Monthly: 1st of every month at 4:00 AM');
    console.log('');
    console.log('🔒 Storage Policy: ALL BACKUPS PERMANENT (Never Auto-Deleted)');
    console.log('📁 All backups stored in: ' + this.allBackupsDir);
    console.log('');
  }

  // Restore collection from backup
  async restoreCollection(backupFilePath, Model) {
    try {
      console.log(`\n🔄 Restoring from backup...`);
      console.log(`📁 File: ${backupFilePath}`);

      // Read backup file
      if (!fs.existsSync(backupFilePath)) {
        throw new Error('Backup file not found!');
      }

      const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
      
      console.log(`\n📊 Backup Information:`);
      console.log(`   • Collection: ${backupData.collectionName}`);
      console.log(`   • Total Records: ${backupData.totalRecords}`);
      console.log(`   • Backup Date: ${backupData.backupDate}`);
      console.log(`   • Data Range: ${backupData.dataRange?.approximateMonths || 'N/A'} months`);
      
      console.log(`\n⚠️⚠️⚠️  WARNING  ⚠️⚠️⚠️`);
      console.log(`This will REPLACE existing data in MongoDB!`);
      console.log(`Make sure you have a recent backup before proceeding!`);
      console.log(`Current MongoDB data will be lost!\n`);

      // Clear existing data
      const deleteResult = await Model.deleteMany({});
      console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing records`);

      // Insert backup data
      if (backupData.data && backupData.data.length > 0) {
        // Clean data (remove _id, __v)
        const cleanData = backupData.data.map(item => {
          const { _id, __v, ...rest } = item;
          return rest;
        });

        const insertResult = await Model.insertMany(cleanData);
        
        console.log(`\n✅ RESTORE COMPLETED SUCCESSFULLY!`);
        console.log(`   • Records Restored: ${insertResult.length}`);
        console.log(`   • Data Range: ${backupData.dataRange?.approximateMonths || 'N/A'} months`);
        console.log('');
        
        return {
          success: true,
          recordsRestored: insertResult.length,
          backupDate: backupData.backupDate,
          dataRange: backupData.dataRange
        };
      }
      
    } catch (error) {
      console.error('❌ Error restoring data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List all available backups (organized by date)
  listAllBackups() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  📋 ALL AVAILABLE BACKUPS (Never Auto-Deleted)           ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    if (!fs.existsSync(this.allBackupsDir)) {
      console.log('No backups found yet.\n');
      return [];
    }

    const years = fs.readdirSync(this.allBackupsDir).filter(f => 
      fs.statSync(path.join(this.allBackupsDir, f)).isDirectory()
    ).sort().reverse();

    let totalBackups = 0;
    let totalSize = 0;

    years.forEach(year => {
      console.log(`\n📅 Year: ${year}`);
      console.log('─'.repeat(60));
      
      const yearPath = path.join(this.allBackupsDir, year);
      const months = fs.readdirSync(yearPath).filter(f =>
        fs.statSync(path.join(yearPath, f)).isDirectory()
      ).sort();

      months.forEach(month => {
        const monthPath = path.join(yearPath, month);
        const files = fs.readdirSync(monthPath).filter(f => f.endsWith('.json'));
        
        if (files.length > 0) {
          console.log(`\n  📁 ${month}:`);
          
          files.forEach(file => {
            const filePath = path.join(monthPath, file);
            const stats = fs.statSync(filePath);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            const date = stats.mtime.toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            console.log(`     📄 ${file}`);
            console.log(`        Size: ${sizeMB} MB | Date: ${date}`);
            
            totalBackups++;
            totalSize += stats.size;
          });
        }
      });
    });

    console.log('\n' + '═'.repeat(60));
    console.log(`\n📊 Total Statistics:`);
    console.log(`   • Total Backup Files: ${totalBackups}`);
    console.log(`   • Total Storage Used: ${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`);
    console.log(`   • Storage Policy: PERMANENT (Never Auto-Deleted)`);
    console.log(`   • Location: ${this.allBackupsDir}`);
    console.log('');

    return { totalBackups, totalSize, years };
  }

  // Get backup statistics
  getBackupStatistics() {
    if (!fs.existsSync(this.allBackupsDir)) {
      return {
        totalBackups: 0,
        totalSize: 0,
        oldestBackup: null,
        newestBackup: null
      };
    }

    let totalBackups = 0;
    let totalSize = 0;
    let oldestDate = null;
    let newestDate = null;

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.json')) {
          totalBackups++;
          totalSize += stats.size;
          
          if (!oldestDate || stats.mtime < oldestDate) {
            oldestDate = stats.mtime;
          }
          if (!newestDate || stats.mtime > newestDate) {
            newestDate = stats.mtime;
          }
        }
      });
    };

    walkDir(this.allBackupsDir);

    return {
      totalBackups,
      totalSize,
      totalSizeGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2),
      oldestBackup: oldestDate,
      newestBackup: newestDate,
      backupSpanDays: oldestDate && newestDate 
        ? Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24))
        : 0
    };
  }

  // Manual backup trigger
  async manualBackup() {
    console.log('\n🔧 Manual backup triggered...');
    return await this.backupAllCollections('manual');
  }

  // Export complete database as single file
  async exportCompleteDatabase() {
    console.log('\n📤 Exporting complete database...\n');
    
    const customers = await Customer.find({}).lean();
    const sales = await Sales.find({}).lean();
    const wholesalers = await Wholesaler.find({}).lean();

    const allDates = [
      ...customers.map(c => new Date(c.date || c.createdAt || Date.now())),
      ...sales.map(s => new Date(s.date || s.createdAt || Date.now()))
    ].filter(d => !isNaN(d.getTime()));

    const oldestDate = allDates.length > 0 
      ? new Date(Math.min(...allDates.map(d => d.getTime()))) 
      : null;
    const newestDate = new Date();
    const totalDays = oldestDate 
      ? Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const completeExport = {
      exportDate: newestDate.toISOString(),
      exportType: 'COMPLETE_DATABASE_EXPORT',
      
      shopInfo: {
        name: 'Your Optical Shop',
        exportVersion: '3.0',
        description: 'Complete database export with ALL historical data'
      },
      
      dataRange: {
        oldestRecord: oldestDate,
        newestRecord: newestDate,
        totalDays: totalDays,
        approximateMonths: Math.floor(totalDays / 30),
        approximateYears: (totalDays / 365).toFixed(1)
      },
      
      statistics: {
        totalCustomers: customers.length,
        totalSales: sales.length,
        totalWholesalers: wholesalers.length,
        grandTotal: customers.length + sales.length + wholesalers.length
      },
      
      collections: {
        customers: customers,
        sales: sales,
        wholesalers: wholesalers
      },
      
      storagePolicy: 'This export is stored permanently and will never be auto-deleted'
    };

    const exportPath = path.join(
      this.getCurrentBackupPath(),
      `COMPLETE_EXPORT_${Date.now()}.json`
    );

    fs.writeFileSync(exportPath, JSON.stringify(completeExport, null, 2));
    
    console.log('✅ Complete database exported successfully!');
    console.log(`📁 Location: ${exportPath}`);
    console.log(`📊 Total Records: ${completeExport.statistics.grandTotal}`);
    console.log(`📅 Data Range: ${completeExport.dataRange.approximateMonths} months (${totalDays} days)`);
    console.log(`💾 File Size: ${(fs.statSync(exportPath).size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`🔒 Storage: PERMANENT (Never Auto-Deleted)\n`);
    
    return exportPath;
  }
}

// ============================================
// USAGE & API HANDLERS
// ============================================

const backupService = new BackupService();

// Initialize backup system
async function initializeBackupSystem() {
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║      🚀 INITIALIZING PERMANENT BACKUP SYSTEM 🚀             ║');
    console.log('║  🔒 ALL Backups Stored Permanently (Like Git Repository)   ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    // Show current backup statistics
    const stats = backupService.getBackupStatistics();
    console.log('📊 Current Backup Statistics:');
    console.log(`   • Existing Backups: ${stats.totalBackups}`);
    console.log(`   • Total Storage: ${stats.totalSizeGB} GB`);
    if (stats.oldestBackup) {
      console.log(`   • Oldest Backup: ${stats.oldestBackup.toLocaleDateString()}`);
      console.log(`   • Backup History: ${stats.backupSpanDays} days`);
    }
    console.log('');

    // Setup automatic schedules
    backupService.setupAutomaticBackups();

    // Take initial backup
    console.log('📦 Taking initial backup...\n');
    await backupService.backupAllCollections('startup');
    
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          ✅ BACKUP SYSTEM READY & ACTIVE ✅                 ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('❌ Error initializing backup system:', error);
  }
}

// API Route Handlers
async function handleManualBackup(req, res) {
  try {
    const result = await backupService.manualBackup();
    res.json({
      success: true,
      message: 'Manual backup completed (stored permanently)',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Backup failed',
      error: error.message
    });
  }
}

async function handleExportDatabase(req, res) {
  try {
    const exportPath = await backupService.exportCompleteDatabase();
    res.download(exportPath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Export failed',
      error: error.message
    });
  }
}

async function handleListBackups(req, res) {
  try {
    const backups = backupService.listAllBackups();
    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async function handleGetStatistics(req, res) {
  try {
    const stats = backupService.getBackupStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async function handleRestoreBackup(req, res) {
  try {
    const { backupFilePath, collection } = req.body;
    
    let Model;
    switch(collection) {
      case 'customers':
        Model = Customer;
        break;
      case 'sales':
        Model = Sales;
        break;
      case 'wholesalers':
        Model = Wholesaler;
        break;
      default:
        throw new Error('Invalid collection name');
    }

    const result = await backupService.restoreCollection(backupFilePath, Model);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Restore failed',
      error: error.message
    });
  }
}

module.exports = {
  BackupService,
  backupService,
  initializeBackupSystem,
  handleManualBackup,
  handleExportDatabase,
  handleListBackups,
  handleGetStatistics,
  handleRestoreBackup
};
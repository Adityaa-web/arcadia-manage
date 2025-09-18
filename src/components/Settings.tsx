import React, { useState } from 'react';
import { Settings as SettingsIcon, Download, Upload, Trash2, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  onBackupData: () => void;
  onRestoreData: (data: any) => void;
  onClearData: () => void;
  studentCount: number;
}

const Settings: React.FC<SettingsProps> = ({
  onBackupData,
  onRestoreData,
  onClearData,
  studentCount,
}) => {
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onRestoreData(data);
        toast({
          title: "Data Restored",
          description: "Student data has been successfully restored from backup.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to restore data. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = async () => {
    setIsClearing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onClearData();
    setIsClearing(false);
    
    toast({
      title: "Data Cleared",
      description: "All student data has been cleared from the system.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your application settings and data</p>
      </div>

      {/* Data Management */}
      <Card className="academic-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stats-card bg-primary/5 border-primary/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{studentCount}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
            </div>
            
            <div className="stats-card bg-accent/5 border-accent/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round((studentCount * 0.125))} MB
                </div>
                <div className="text-sm text-muted-foreground">Estimated Size</div>
              </div>
            </div>
            
            <div className="stats-card bg-success/5 border-success/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Backup & Restore */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Backup & Restore</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="backup">Create Backup</Label>
                <Button 
                  onClick={onBackupData}
                  className="w-full academic-input border-primary/20 hover:border-primary/50"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Backup
                </Button>
                <p className="text-xs text-muted-foreground">
                  Downloads all student data as a JSON file
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="restore">Restore from Backup</Label>
                <div className="relative">
                  <Input
                    id="restore"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="academic-input border-accent/20 hover:border-accent/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a JSON backup file to restore data
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            
            <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-medium text-destructive">Clear All Data</h4>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete all student records. This action cannot be undone.
                  </p>
                </div>
                
                <Button 
                  onClick={handleClearData}
                  disabled={isClearing || studentCount === 0}
                  variant="destructive"
                  className="shrink-0"
                >
                  {isClearing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  {isClearing ? 'Clearing...' : 'Clear All Data'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Info */}
      <Card className="academic-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Version:</span>
              <span className="ml-2 text-muted-foreground">1.0.0</span>
            </div>
            <div>
              <span className="font-medium">Build:</span>
              <span className="ml-2 text-muted-foreground">StudentFlow-2024</span>
            </div>
            <div>
              <span className="font-medium">Last Backup:</span>
              <span className="ml-2 text-muted-foreground">
                {localStorage.getItem('lastBackup') || 'Never'}
              </span>
            </div>
            <div>
              <span className="font-medium">Storage:</span>
              <span className="ml-2 text-muted-foreground">Local Storage</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>StudentFlow - Modern Student Management System</p>
            <p>Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
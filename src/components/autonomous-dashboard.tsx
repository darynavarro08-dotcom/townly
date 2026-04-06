'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { autonomousAgent } from '@/lib/autonomous-agent';
import { Brain, Activity, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

interface AgentStatus {
  isRunning: boolean;
  lastCheck: Date;
  nextCheck: Date | null;
}

interface CommunityMetrics {
  engagement: number;
  duesCollected: number;
  votesActive: number;
  issuesResolved: number;
  autonomousActions: number;
}

export default function AutonomousDashboard() {
  const [status, setStatus] = useState<AgentStatus>({
    isRunning: false,
    lastCheck: new Date(),
    nextCheck: null
  });
  
  const [metrics, setMetrics] = useState<CommunityMetrics>({
    engagement: 78,
    duesCollected: 85,
    votesActive: 2,
    issuesResolved: 12,
    autonomousActions: 47
  });

  const [recentActions, setRecentActions] = useState([
    { id: 1, action: 'Sent engagement reminders to 3 inactive members', time: '5 min ago', type: 'engagement' },
    { id: 2, action: 'Escalated high-priority maintenance issue', time: '12 min ago', type: 'maintenance' },
    { id: 3, action: 'Detected voting quorum risk - sent reminders', time: '18 min ago', type: 'voting' },
    { id: 4, action: 'Processed 2 overdue payment reminders', time: '25 min ago', type: 'dues' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(autonomousAgent.getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleAgent = () => {
    if (status.isRunning) {
      autonomousAgent.stopMonitoring();
    } else {
      autonomousAgent.startMonitoring();
    }
    setStatus(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'engagement': return <Activity className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      case 'voting': return <CheckCircle className="h-4 w-4" />;
      case 'dues': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Autonomous Agent Control
          </h2>
          <p className="text-muted-foreground">
            GLM 5.1-powered community management system
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Agent Status</p>
            <Badge variant={status.isRunning ? "default" : "secondary"}>
              {status.isRunning ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <Switch
            checked={status.isRunning}
            onCheckedChange={toggleAgent}
            disabled={!process.env.GLM_API_KEY}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.engagement}%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dues Collection</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.duesCollected}%</div>
            <p className="text-xs text-muted-foreground">
              $12,400 collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Votes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.votesActive}</div>
            <p className="text-xs text-muted-foreground">
              1 needs attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autonomous Actions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.autonomousActions}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Autonomous Actions</CardTitle>
            <CardDescription>
              Latest actions taken by the GLM 5.1 agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action) => (
                <div key={action.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  {getActionIcon(action.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.action}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {action.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>
              Real-time monitoring and execution status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">GLM 5.1 Connection</span>
                <Badge variant="default">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Monitoring Interval</span>
                <span className="text-sm">15 minutes</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Last Check</span>
                <span className="text-sm">{status.lastCheck.toLocaleTimeString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Next Check</span>
                <span className="text-sm">
                  {status.nextCheck ? status.nextCheck.toLocaleTimeString() : 'Not scheduled'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Autonomous Mode</span>
                <Badge variant={status.isRunning ? "default" : "secondary"}>
                  {status.isRunning ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Controls</CardTitle>
          <CardDescription>
            Trigger specific autonomous workflows manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => {/* Trigger engagement recovery */}}
            >
              <Activity className="h-6 w-6" />
              <span className="text-xs">Engagement Recovery</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => {/* Trigger dues collection */}}
            >
              <Zap className="h-6 w-6" />
              <span className="text-xs">Dues Collection</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => {/* Trigger voting reminder */}}
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-xs">Voting Reminder</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => {/* Trigger maintenance check */}}
            >
              <AlertTriangle className="h-6 w-6" />
              <span className="text-xs">Maintenance Check</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

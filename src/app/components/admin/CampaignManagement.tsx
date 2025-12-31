import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Plus, Pencil, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  totalSpins: number;
  startDate: string;
  endDate: string;
  spinsLimit: number;
  prizes: Prize[];
}

interface Prize {
  id: string;
  type: string;
  value: string;
  probability: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2025',
    status: 'active',
    totalSpins: 1247,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    spinsLimit: 5000,
    prizes: [
      { id: 'p1', type: 'percentage', value: '10', probability: 20 },
      { id: 'p2', type: 'percentage', value: '15', probability: 15 },
      { id: 'p3', type: 'free-shipping', value: 'Free Shipping', probability: 15 },
    ],
  },
  {
    id: '2',
    name: 'New Year Special',
    status: 'inactive',
    totalSpins: 3421,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    spinsLimit: 10000,
    prizes: [
      { id: 'p4', type: 'percentage', value: '20', probability: 10 },
      { id: 'p5', type: 'fixed', value: '5', probability: 10 },
    ],
  },
  {
    id: '3',
    name: 'Black Friday Mega Sale',
    status: 'active',
    totalSpins: 892,
    startDate: '2025-11-25',
    endDate: '2025-11-30',
    spinsLimit: 20000,
    prizes: [
      { id: 'p6', type: 'percentage', value: '25', probability: 5 },
      { id: 'p7', type: 'percentage', value: '10', probability: 20 },
    ],
  },
];

export function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    spinsLimit: '',
    status: 'active' as 'active' | 'inactive',
  });

  const handleCreateCampaign = () => {
    if (!formData.name || !formData.startDate || !formData.endDate || !formData.spinsLimit) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: formData.name,
      status: formData.status,
      totalSpins: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      spinsLimit: parseInt(formData.spinsLimit),
      prizes: [],
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsCreateModalOpen(false);
    setFormData({ name: '', startDate: '', endDate: '', spinsLimit: '', status: 'active' });
    toast.success('Campaign created successfully!');
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success('Campaign deleted successfully');
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' as const : 'active' as const } : c
    ));
    toast.success('Campaign status updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-gray-900">Campaign Management</h2>
          <p className="text-gray-600 mt-1">Create and manage your spin wheel campaigns</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new spin wheel campaign for your store
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name *</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Summer Sale 2025"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="spins-limit">Spins Limit *</Label>
                <Input
                  id="spins-limit"
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.spinsLimit}
                  onChange={(e) => setFormData({ ...formData, spinsLimit: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Campaign Status</Label>
                  <p className="text-sm text-gray-500">Enable or disable this campaign</p>
                </div>
                <Switch
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} className="bg-purple-600 hover:bg-purple-700">
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3" />
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </CardDescription>
                </div>
                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Total Spins</span>
                  </div>
                  <span className="font-bold text-purple-600">{campaign.totalSpins.toLocaleString()}</span>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Limit</span>
                    <span className="font-medium">{campaign.spinsLimit.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${(campaign.totalSpins / campaign.spinsLimit) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {Math.round((campaign.totalSpins / campaign.spinsLimit) * 100)}% used
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingCampaign(campaign)}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCampaignStatus(campaign.id)}
                  >
                    {campaign.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-4">Create your first spin wheel campaign to get started</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
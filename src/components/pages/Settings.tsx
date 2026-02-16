import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [slackNotif, setSlackNotif] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage system configuration and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        {/* Tab Navigation */}
        <TabsList className="bg-muted/40 p-1 rounded-lg">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          <TabsTrigger value="theme">Theme Settings</TabsTrigger>
        </TabsList>

        {/* ---------------- General ---------------- */}
        <TabsContent value="general">
          <Card className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-card-foreground">
                Organization Name
              </h3>
              <Input placeholder="Enter organization name" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-card-foreground">
                Timezone
              </h3>
              <Input placeholder="e.g. Asia/Kolkata" />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="h-9 px-6 rounded-lg">
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- API Configuration ---------------- */}
        <TabsContent value="api">
          <Card className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-card-foreground">
                API Base URL
              </h3>
              <Input placeholder="https://api.yourdomain.com" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-card-foreground">
                API Key
              </h3>
              <Input placeholder="Enter API key" type="password" />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="h-9 px-6 rounded-lg">
                Update API Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- Notifications ---------------- */}
        <TabsContent value="notifications">
          <Card className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive system alerts via email
                </p>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Slack Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Send activity alerts to Slack
                </p>
              </div>
              <Switch checked={slackNotif} onCheckedChange={setSlackNotif} />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="h-9 px-6 rounded-lg">
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- Theme ---------------- */}
        <TabsContent value="theme">
          <Card className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Dark Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable dark interface theme
                </p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="h-9 px-6 rounded-lg">
                Apply Theme
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

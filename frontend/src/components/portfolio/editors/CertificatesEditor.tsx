"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/types/portfolio";
import { Plus, Trash2 } from "lucide-react";

interface CertificatesEditorProps {
  certificates: Certificate[];
  onChange: (certificates: Certificate[]) => void;
}

export function CertificatesEditor({ certificates, onChange }: CertificatesEditorProps) {
  const addCertificate = () => {
    onChange([
      ...certificates,
      {
        id: `cert-${Date.now()}`,
        name: "",
        organization: "",
        issueDate: "",
      },
    ]);
  };

  const updateCertificate = (index: number, field: keyof Certificate, value: any) => {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeCertificate = (index: number) => {
    onChange(certificates.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-violet-500/20 border border-white/10 p-6 backdrop-blur">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-primary">Certificates</h3>
            <p className="text-sm text-text-muted">Add your professional certifications</p>
          </div>
          <Button onClick={addCertificate} size="sm" className="gradient-bg !text-white border-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      </div>

      {certificates.map((cert, index) => (
        <Card key={cert.id} className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-text-primary">Certificate {index + 1}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeCertificate(index)}>
                <Trash2 className="h-4 w-4 text-rose-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary/80">Certificate Name *</Label>
                <Input value={cert.name} onChange={(e) => updateCertificate(index, "name", e.target.value)} placeholder="AWS Certified Solutions Architect" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Organization *</Label>
                <Input value={cert.organization} onChange={(e) => updateCertificate(index, "organization", e.target.value)} placeholder="Amazon Web Services" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Issue Date</Label>
                <Input type="month" value={cert.issueDate} onChange={(e) => updateCertificate(index, "issueDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Credential ID</Label>
                <Input value={cert.credentialId || ""} onChange={(e) => updateCertificate(index, "credentialId", e.target.value)} placeholder="ABC123XYZ" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-text-primary/80">Verification Link</Label>
                <Input value={cert.verificationLink || ""} onChange={(e) => updateCertificate(index, "verificationLink", e.target.value)} placeholder="https://verify.example.com/cert/123" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {certificates.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-text-muted mb-4">No certificates added yet</p>
            <Button onClick={addCertificate} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Certificate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

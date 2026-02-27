import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Upload, Video, Image, Link as LinkIcon } from "lucide-react";

interface StoryMedia {
  id: string;
  title: string;
  description: string | null;
  media_type: "image" | "video" | "embed";
  media_url: string;
  thumbnail_url: string | null;
  section: string;
  display_order: number;
  is_published: boolean;
}

export function AdminStoryMedia() {
  const [media, setMedia] = useState<StoryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<StoryMedia | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_type: "image" as "image" | "video" | "embed",
    media_url: "",
    thumbnail_url: "",
    section: "heritage",
    display_order: 0,
    is_published: true,
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from("story_media")
      .select("*")
      .order("section")
      .order("display_order");

    if (!error && data) {
      setMedia(data as StoryMedia[]);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const isVideo = file.type.startsWith("video/");
    const filePath = `${isVideo ? "videos" : "images"}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("story-media")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
    } else {
      const { data } = supabase.storage
        .from("story-media")
        .getPublicUrl(filePath);
      
      setFormData({
        ...formData,
        media_url: data.publicUrl,
        media_type: isVideo ? "video" : "image",
      });
      toast({ title: "File uploaded successfully" });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mediaData = {
      title: formData.title,
      description: formData.description || null,
      media_type: formData.media_type,
      media_url: formData.media_url,
      thumbnail_url: formData.thumbnail_url || null,
      section: formData.section,
      display_order: formData.display_order,
      is_published: formData.is_published,
    };

    if (editingMedia) {
      const { error } = await supabase
        .from("story_media")
        .update(mediaData)
        .eq("id", editingMedia.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Media updated" });
        fetchMedia();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("story_media").insert(mediaData);

      if (error) {
        toast({ title: "Creation failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Media added" });
        fetchMedia();
        resetForm();
      }
    }
  };

  const handleEdit = (item: StoryMedia) => {
    setEditingMedia(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || "",
      section: item.section,
      display_order: item.display_order,
      is_published: item.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media?")) return;

    const { error } = await supabase.from("story_media").delete().eq("id", id);

    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Media deleted" });
      fetchMedia();
    }
  };

  const resetForm = () => {
    setEditingMedia(null);
    setFormData({
      title: "",
      description: "",
      media_type: "image",
      media_url: "",
      thumbnail_url: "",
      section: "heritage",
      display_order: 0,
      is_published: true,
    });
    setIsDialogOpen(false);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />;
      case "embed": return <LinkIcon className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl">Our Story Media</h2>
          <p className="text-sm text-muted-foreground">
            Manage images and videos for the Our Story page
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingMedia ? "Edit Media" : "Add Media"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.media_type}
                    onValueChange={(v) => setFormData({ ...formData, media_type: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="embed">YouTube/Vimeo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(v) => setFormData({ ...formData, section: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heritage">Ethiopian Heritage</SelectItem>
                      <SelectItem value="purpose">Our Purpose</SelectItem>
                      <SelectItem value="collection">Our Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.media_type !== "embed" ? (
                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <Input
                    type="file"
                    accept={formData.media_type === "video" ? "video/*" : "image/*"}
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  {formData.media_url && (
                    <p className="text-xs text-muted-foreground truncate">
                      {formData.media_url}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Embed URL *</Label>
                  <Input
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {editingMedia ? "Save" : "Add Media"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 bg-card/30 rounded-xl border border-border">
          <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No media added yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {["heritage", "purpose", "collection"].map((section) => {
            const sectionMedia = media.filter((m) => m.section === section);
            if (sectionMedia.length === 0) return null;

            return (
              <div key={section} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground capitalize">
                  {section === "heritage" ? "Ethiopian Heritage" : section === "purpose" ? "Our Purpose" : "Our Collection"}
                </h3>
                <div className="space-y-2">
                  {sectionMedia.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-card/30 border border-border rounded-lg"
                    >
                      <div className="w-16 h-12 bg-secondary rounded overflow-hidden shrink-0">
                        {item.media_type === "image" && (
                          <img src={item.media_url} alt="" className="w-full h-full object-cover" />
                        )}
                        {item.media_type === "video" && (
                          <video src={item.media_url} className="w-full h-full object-cover" />
                        )}
                        {item.media_type === "embed" && (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <LinkIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          {getMediaIcon(item.media_type)}
                          {item.media_type}
                          {!item.is_published && (
                            <span className="text-amber-500">• Draft</span>
                          )}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

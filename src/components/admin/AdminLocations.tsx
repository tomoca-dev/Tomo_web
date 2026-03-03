 import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { useToast } from "@/hooks/use-toast";
 import { MapPin, Plus, Trash2, Edit2, Star, X, Check, Upload, ImageIcon } from "lucide-react";
 import { Switch } from "@/components/ui/switch";
 import { Label } from "@/components/ui/label";
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 
 interface StoreLocation {
   id: string;
   name: string;
   address: string;
   city: string;
   region: string | null;
   country: string;
   phone: string | null;
   is_flagship: boolean | null;
   is_active: boolean | null;
   image_url: string | null;
 }
 
 export function AdminLocations() {
   const [locations, setLocations] = useState<StoreLocation[]>([]);
   const [loading, setLoading] = useState(true);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [editingLocation, setEditingLocation] = useState<StoreLocation | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    region: "",
    country: "Ethiopia",
    phone: "",
    is_flagship: false,
    is_active: true,
    image_url: "",
    latitude: "",
    longitude: "",
  });
   const { toast } = useToast();
 
   useEffect(() => {
     fetchLocations();
   }, []);
 
   const fetchLocations = async () => {
     const { data, error } = await supabase
       .from("store_locations")
       .select("*")
       .order("is_flagship", { ascending: false });
 
     if (!error && data) {
       setLocations(data);
     }
     setLoading(false);
   };
 
   const handleSubmit = async () => {
     if (!formData.name || !formData.address || !formData.city) {
       toast({
         title: "Error",
         description: "Please fill in all required fields",
         variant: "destructive",
       });
       return;
     }
 
    const locationData = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      region: formData.region || null,
      country: formData.country,
      phone: formData.phone || null,
      is_flagship: formData.is_flagship,
      is_active: formData.is_active,
      image_url: formData.image_url || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    };
 
     if (editingLocation) {
       const { error } = await supabase
         .from("store_locations")
         .update(locationData)
         .eq("id", editingLocation.id);
 
       if (error) {
         toast({ title: "Error", description: error.message, variant: "destructive" });
       } else {
         toast({ title: "Success", description: "Location updated" });
         setIsDialogOpen(false);
         fetchLocations();
       }
     } else {
       const { error } = await supabase.from("store_locations").insert(locationData);
 
       if (error) {
         toast({ title: "Error", description: error.message, variant: "destructive" });
       } else {
         toast({ title: "Success", description: "Location added" });
         setIsDialogOpen(false);
         fetchLocations();
       }
     }
 
     resetForm();
   };
 
   const handleDelete = async (id: string) => {
     const { error } = await supabase.from("store_locations").delete().eq("id", id);
 
     if (error) {
       toast({ title: "Error", description: error.message, variant: "destructive" });
     } else {
       toast({ title: "Success", description: "Location deleted" });
       fetchLocations();
     }
   };
 
   const handleEdit = (location: StoreLocation) => {
     setEditingLocation(location);
     setFormData({
       name: location.name,
       address: location.address,
       city: location.city,
       region: location.region || "",
       country: location.country,
       phone: location.phone || "",
      is_flagship: location.is_flagship || false,
      is_active: location.is_active ?? true,
      image_url: location.image_url || "",
      latitude: (location as any).latitude?.toString() || "",
      longitude: (location as any).longitude?.toString() || "",
    });
     setIsDialogOpen(true);
   };
 
   const resetForm = () => {
     setEditingLocation(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      region: "",
      country: "Ethiopia",
      phone: "",
      is_flagship: false,
      is_active: true,
      image_url: "",
      latitude: "",
      longitude: "",
    });
   };
 
   const toggleActive = async (id: string, currentStatus: boolean) => {
     const { error } = await supabase
       .from("store_locations")
       .update({ is_active: !currentStatus })
       .eq("id", id);
 
     if (!error) {
       fetchLocations();
     }
   };
 
   return (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-display">Store Locations</h2>
           <p className="text-muted-foreground">Manage your coffee shop locations</p>
         </div>
         <Dialog open={isDialogOpen} onOpenChange={(open) => {
           setIsDialogOpen(open);
           if (!open) resetForm();
         }}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="w-4 h-4 mr-2" />
               Add Location
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>
                 {editingLocation ? "Edit Location" : "Add New Location"}
               </DialogTitle>
             </DialogHeader>
             <div className="space-y-4 pt-4">
               <div>
                 <Label>Name *</Label>
                 <Input
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   placeholder="TOMOCA Bole"
                 />
               </div>
               <div>
                 <Label>Address *</Label>
                 <Input
                   value={formData.address}
                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                   placeholder="Bole Road, Atlas Area"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label>City *</Label>
                   <Input
                     value={formData.city}
                     onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                     placeholder="Addis Ababa"
                   />
                 </div>
                 <div>
                   <Label>Region</Label>
                   <Input
                     value={formData.region}
                     onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                     placeholder="Addis Ababa"
                   />
                 </div>
               </div>
               <div>
                 <Label>Phone</Label>
                 <Input
                   value={formData.phone}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   placeholder="+251 11 222 3456"
                 />
               </div>
              <div>
                  <Label>Location Image</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {formData.image_url ? (
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="location-image-upload"
                        disabled={uploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          const ext = file.name.split(".").pop();
                          const path = `locations/${Date.now()}.${ext}`;
                          const { error } = await supabase.storage.from("product-images").upload(path, file);
                          if (error) {
                            toast({ title: "Upload failed", description: error.message, variant: "destructive" });
                          } else {
                            const { data } = supabase.storage.from("product-images").getPublicUrl(path);
                            setFormData({ ...formData, image_url: data.publicUrl });
                          }
                          setUploading(false);
                        }}
                      />
                      <label htmlFor="location-image-upload">
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                          <span><Upload className="w-3 h-3 mr-1" />{uploading ? "Uploading..." : "Upload"}</span>
                        </Button>
                      </label>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="Or paste URL..."
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="9.0054"
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="38.7636"
                    />
                  </div>
                </div>
               <div className="flex items-center justify-between">
                 <Label>Flagship Store</Label>
                 <Switch
                   checked={formData.is_flagship}
                   onCheckedChange={(checked) => setFormData({ ...formData, is_flagship: checked })}
                 />
               </div>
               <div className="flex items-center justify-between">
                 <Label>Active</Label>
                 <Switch
                   checked={formData.is_active}
                   onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                 />
               </div>
               <Button onClick={handleSubmit} className="w-full">
                 {editingLocation ? "Update Location" : "Add Location"}
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="h-32 bg-secondary/30 rounded-lg animate-pulse" />
           ))}
         </div>
       ) : locations.length === 0 ? (
         <Card className="bg-card/50 border-border">
           <CardContent className="py-12 text-center">
             <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
             <h3 className="font-medium mb-2">No locations yet</h3>
             <p className="text-sm text-muted-foreground">Add your first store location</p>
           </CardContent>
         </Card>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {locations.map((location) => (
             <Card key={location.id} className={`bg-card/50 border-border ${!location.is_active ? 'opacity-60' : ''}`}>
               <CardContent className="p-4">
                 <div className="flex justify-between items-start">
                   <div className="flex items-start gap-3">
                     <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                       <MapPin className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h3 className="font-medium">{location.name}</h3>
                         {location.is_flagship && (
                           <Star className="w-4 h-4 text-primary fill-primary" />
                         )}
                       </div>
                       <p className="text-sm text-muted-foreground">{location.address}</p>
                       <p className="text-sm text-muted-foreground">
                         {location.city}{location.region && `, ${location.region}`}
                       </p>
                       {location.phone && (
                         <p className="text-sm text-muted-foreground mt-1">{location.phone}</p>
                       )}
                     </div>
                   </div>
                   <div className="flex items-center gap-1">
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={() => toggleActive(location.id, location.is_active ?? true)}
                       className={location.is_active ? "text-green-500" : "text-muted-foreground"}
                     >
                       {location.is_active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                     </Button>
                     <Button variant="ghost" size="icon" onClick={() => handleEdit(location)}>
                       <Edit2 className="w-4 h-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(location.id)}>
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       )}
     </div>
   );
 }
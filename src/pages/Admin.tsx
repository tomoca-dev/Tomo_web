import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Package, ImageIcon, Video, Star, Coffee, FileText } from "lucide-react";
 import { Users, MapPin } from "lucide-react";
import { Navigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStoryMedia } from "@/components/admin/AdminStoryMedia";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { BeanDensityAdmin } from "@/components/admin/BeanDensityAdmin";
 import { AdminUserRoles } from "@/components/admin/AdminUserRoles";
 import { AdminLocations } from "@/components/admin/AdminLocations";
import { AdminBlogPosts } from "@/components/admin/AdminBlogPosts";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  origin: string | null;
  roast_level: string | null;
  weight_grams: number | null;
  is_featured: boolean | null;
  is_available: boolean | null;
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    origin: "",
    roast_level: "",
    weight_grams: "250",
    is_featured: false,
    is_available: true,
    image_url: "",
  });

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoadingProducts(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
    } else {
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      
      setFormData({ ...formData, image_url: data.publicUrl });
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      origin: formData.origin || null,
      roast_level: formData.roast_level || null,
      weight_grams: parseInt(formData.weight_grams) || 250,
      is_featured: formData.is_featured,
      is_available: formData.is_available,
      image_url: formData.image_url || null,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Product updated" });
        fetchProducts();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("products").insert(productData);

      if (error) {
        toast({ title: "Creation failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Product created" });
        fetchProducts();
        resetForm();
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      origin: product.origin || "",
      roast_level: product.roast_level || "",
      weight_grams: (product.weight_grams || 250).toString(),
      is_featured: product.is_featured || false,
      is_available: product.is_available ?? true,
      image_url: product.image_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product deleted" });
      fetchProducts();
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      origin: "",
      roast_level: "",
      weight_grams: "250",
      is_featured: false,
      is_available: true,
      image_url: "",
    });
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <Layout showGlobalBeans={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout showGlobalBeans={false}>
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage products, content, and settings</p>
          </motion.div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-card/50 border border-border">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" /> Products
              </TabsTrigger>
              <TabsTrigger value="story" className="flex items-center gap-2">
                <Video className="w-4 h-4" /> Story Media
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="w-4 h-4" /> Reviews
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Journal
              </TabsTrigger>
               <TabsTrigger value="locations" className="flex items-center gap-2">
                 <MapPin className="w-4 h-4" /> Locations
               </TabsTrigger>
               <TabsTrigger value="users" className="flex items-center gap-2">
                 <Users className="w-4 h-4" /> Users
               </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Coffee className="w-4 h-4" /> Settings
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="gold-gradient text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="origin">Origin</Label>
                          <Input
                            id="origin"
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            placeholder="e.g., Ethiopia"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roast_level">Roast Level</Label>
                          <Input
                            id="roast_level"
                            value={formData.roast_level}
                            onChange={(e) => setFormData({ ...formData, roast_level: e.target.value })}
                            placeholder="e.g., Medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (g)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={formData.weight_grams}
                            onChange={(e) => setFormData({ ...formData, weight_grams: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label>Product Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-card border border-border rounded-lg flex items-center justify-center overflow-hidden">
                            {formData.image_url ? (
                              <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload">
                              <Button type="button" variant="outline" className="cursor-pointer" asChild>
                                <span>
                                  <Upload className="w-4 h-4 mr-2" />
                                  {uploading ? "Uploading..." : "Upload Image"}
                                </span>
                              </Button>
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Or paste a URL below</p>
                            <Input
                              placeholder="https://..."
                              value={formData.image_url}
                              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                          <Switch
                            id="featured"
                            checked={formData.is_featured}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                          />
                          <Label htmlFor="featured">Featured Product</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="available"
                            checked={formData.is_available}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                          />
                          <Label htmlFor="available">Available</Label>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end">
                        <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                        <Button type="submit" className="gold-gradient text-primary-foreground">
                          {editingProduct ? "Save Changes" : "Create Product"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Products Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden"
              >
                {loadingProducts ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-display text-xl mb-2">No products yet</h3>
                    <p className="text-muted-foreground">Add your first product to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Image</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Price</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Origin</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                          <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden">
                                {product.image_url ? (
                                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.roast_level} Roast</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-muted-foreground">{product.origin || "—"}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {product.is_featured && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Featured</span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded ${product.is_available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                  {product.is_available ? "Available" : "Unavailable"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Story Media Tab */}
            <TabsContent value="story">
              <AdminStoryMedia />
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <AdminReviews />
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal">
              <AdminBlogPosts />
            </TabsContent>

             {/* Locations Tab */}
             <TabsContent value="locations">
               <AdminLocations />
             </TabsContent>
 
             {/* Users Tab */}
             <TabsContent value="users">
               <AdminUserRoles />
             </TabsContent>
 
            {/* Settings Tab */}
            <TabsContent value="settings">
              <BeanDensityAdmin />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}

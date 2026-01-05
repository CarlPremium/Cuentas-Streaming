'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit, Trash2, ExternalLink, Store as StoreIcon, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Product {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  original_price?: number
  category: string
  duration?: string
  image_url?: string
  is_active: boolean
  is_featured: boolean
  is_popular: boolean
  created_at: string
}

interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  color?: string
}

interface StoreSettings {
  telegram_handle: string
  store_name: string
}

// Hardcoded fallback categories
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Streaming', slug: 'streaming', icon: 'Tv', color: '#8B5CF6' },
  { id: 2, name: 'Música', slug: 'musica', icon: 'Music', color: '#06B6D4' },
  { id: 3, name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', color: '#10B981' },
  { id: 4, name: 'Productividad', slug: 'productividad', icon: 'Briefcase', color: '#F59E0B' },
  { id: 5, name: 'Educación', slug: 'educacion', icon: 'GraduationCap', color: '#EC4899' },
  { id: 6, name: 'Software', slug: 'software', icon: 'Code', color: '#6366F1' },
  { id: 7, name: 'Cloud Storage', slug: 'cloud-storage', icon: 'Cloud', color: '#3B82F6' },
  { id: 8, name: 'VPN', slug: 'vpn', icon: 'Shield', color: '#EF4444' },
]

export default function StoreManagement({ user }: { user: any }) {
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    duration: '',
    image_url: '',
    features: '',
    is_active: true,
    is_featured: false,
    is_popular: false,
  })

  // Features as array for tags
  const [featureTags, setFeatureTags] = useState<string[]>([])
  const [currentFeature, setCurrentFeature] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch products
      const productsRes = await fetch('/api/v1/products?is_active=false')
      if (!productsRes.ok) throw new Error('Failed to fetch products')
      const productsData = await productsRes.json()
      setProducts(productsData.products || [])

      // Fetch categories from database
      try {
        const categoriesRes = await fetch('/api/v1/categories')
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          // Use database categories if available, otherwise keep fallback
          if (categoriesData.categories && categoriesData.categories.length > 0) {
            setCategories(categoriesData.categories)
          }
        }
      } catch (error) {
        console.log('Using fallback categories:', error)
        // Keep DEFAULT_CATEGORIES as fallback
      }

      // Fetch store settings
      const settingsRes = await fetch('/api/v1/store/settings')
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData.settings)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load store data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        features: featureTags, // Use tags array instead of comma-separated string
      }

      const res = await fetch('/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      toast({
        title: 'Success',
        description: 'Product created successfully',
      })

      setIsCreateDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  // Tag management functions
  const addFeatureTag = () => {
    const trimmed = currentFeature.trim()
    if (trimmed && !featureTags.includes(trimmed)) {
      setFeatureTags([...featureTags, trimmed])
      setCurrentFeature('')
    }
  }

  const removeFeatureTag = (tagToRemove: string) => {
    setFeatureTags(featureTags.filter(tag => tag !== tagToRemove))
  }

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeatureTag()
    } else if (e.key === 'Backspace' && currentFeature === '' && featureTags.length > 0) {
      // Remove last tag when backspace on empty input
      setFeatureTags(featureTags.slice(0, -1))
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        features: featureTags, // Use tags array instead of comma-separated string
      }

      const res = await fetch(`/api/v1/products/${selectedProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      })

      setIsEditDialogOpen(false)
      setSelectedProduct(null)
      resetForm()
      fetchData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/v1/products/${productId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      })

      fetchData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category: product.category,
      duration: product.duration || '',
      image_url: product.image_url || '',
      features: '',
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_popular: product.is_popular,
    })
    // Set feature tags from product
    const features = product.features
    if (Array.isArray(features)) {
      setFeatureTags(features)
    } else if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features)
        setFeatureTags(Array.isArray(parsed) ? parsed : [])
      } catch {
        setFeatureTags(features.split(',').map(f => f.trim()))
      }
    } else {
      setFeatureTags([])
    }
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      original_price: '',
      category: '',
      duration: '',
      image_url: '',
      features: '',
      is_active: true,
      is_featured: false,
      is_popular: false,
    })
    setFeatureTags([])
    setCurrentFeature('')
  }

  const handleTelegramRedirect = (productName: string) => {
    if (!settings?.telegram_handle) {
      toast({
        title: 'Error',
        description: 'Telegram handle not configured',
        variant: 'destructive',
      })
      return
    }

    const message = encodeURIComponent(`Hello! I'm interested in ${productName}`)
    const telegramUrl = `https://t.me/${settings.telegram_handle.replace('@', '')}?text=${message}`
    window.open(telegramUrl, '_blank')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Store Management</h1>
            <p className="text-muted-foreground">Manage your products and sales</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your product catalog ({products.length} products)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StoreIcon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div>
                        ${product.price}
                        {product.original_price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.is_active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {product.is_featured && <Badge variant="outline">Featured</Badge>}
                        {product.is_popular && <Badge variant="outline">Popular</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTelegramRedirect(product.name)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your store catalog
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    // Generate hexadecimal slug automatically
                    const hexSlug = Array.from(name)
                      .map(c => c.charCodeAt(0).toString(16))
                      .join('')
                      .substring(0, 32) || Math.random().toString(16).substring(2, 18)
                    setFormData({ ...formData, name, slug: hexSlug })
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (auto-generated hexadecimal) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.replace(/[^a-f0-9]/g, '') })}
                  placeholder="Auto-generated or enter hexadecimal"
                  required
                  readOnly
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
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
              <div>
                <Label htmlFor="original_price">Original Price ($)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 1 Mes"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category || undefined}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="features">Features</Label>
              <div className="space-y-2">
                {/* Tags Display */}
                {featureTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                    {featureTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="gap-1 pl-2 pr-1 py-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeFeatureTag(tag)}
                          className="hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {/* Input for new feature */}
                <Input
                  id="features"
                  placeholder="Type a feature and press Enter (e.g., 4K Ultra HD)"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  onBlur={addFeatureTag}
                />
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 text-xs bg-muted border rounded">Enter</kbd> or click away to add a feature tag
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_popular"
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
                />
                <Label htmlFor="is_popular">Popular</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsCreateDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit">Create Product</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog - Similar to Create but with PATCH */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            {/* Same form fields as create */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price">Price ($) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={formData.category || undefined}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="edit-is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="edit-is_active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedProduct(null)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit">Update Product</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { X, CheckCheckIcon, Gem } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { createProduct, updateProduct } from '@/api/productApi'

const productFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(150),
  category: z.enum(['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Bespoke']),
  metal: z.enum(['24K Gold', '22K Gold', '18K White Gold', '18K Rose Gold', 'Platinum']),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  imageUrl: z.string().url('Must be a valid image URL').or(z.literal('')),
  isFeatured: z.boolean().default(false),
  description: z.string().min(10, 'Description must be at least 10 characters')
})

export function ProductFormModal({ isOpen, onClose, onSuccess, productToEdit = null }) {
  const isEditing = Boolean(productToEdit?._id)

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      category: 'Rings',
      metal: '24K Gold',
      price: 1500,
      stock: 1,
      imageUrl: '',
      isFeatured: false,
      description: ''
    }
  })

  useEffect(() => {
    if (productToEdit) {
      form.reset({
        title: productToEdit.title || '',
        category: productToEdit.category || 'Rings',
        metal: productToEdit.metal || '24K Gold',
        price: productToEdit.price || 0,
        stock: productToEdit.stock ?? 1,
        imageUrl: productToEdit.images?.[0] || '',
        isFeatured: Boolean(productToEdit.isFeatured),
        description: productToEdit.description || ''
      })
    } else {
      form.reset({
        title: '',
        category: 'Rings',
        metal: '24K Gold',
        price: 2500,
        stock: 1,
        imageUrl: '',
        isFeatured: false,
        description: ''
      })
    }
  }, [productToEdit, form])

  if (!isOpen) return null

  const onSubmit = async (values) => {
    try {
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36)

      const payload = {
        title: values.title,
        slug: productToEdit?.slug || slug,
        category: values.category,
        metal: values.metal,
        price: Number(values.price),
        stock: Number(values.stock),
        isFeatured: values.isFeatured,
        description: values.description,
        images: values.imageUrl ? [values.imageUrl] : []
      }

      if (isEditing) {
        await updateProduct(productToEdit._id, payload)
        toast.custom(() => (
          <Alert className="border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 *:[svg]:row-span-1">
            <CheckCheckIcon />
            <AlertTitle>Masterpiece updated successfully!</AlertTitle>
          </Alert>
        ))
      } else {
        await createProduct(payload)
        toast.custom(() => (
          <Alert className="border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 *:[svg]:row-span-1">
            <CheckCheckIcon />
            <AlertTitle>Masterpiece added to inventory!</AlertTitle>
          </Alert>
        ))
      }

      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-border">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <Gem className="size-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {isEditing ? 'Modify Atelier Masterpiece' : 'Commission New Masterpiece'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Define catalog metadata, gemstones, metal standards, and pricing
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                <FieldLabel htmlFor="product-title">Piece Title</FieldLabel>
                <input
                  id="product-title"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Royal Constellation Diamond Solitaire"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <FieldDescription>Exclusive catalog headline for the piece</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                  <FieldLabel htmlFor="product-category">Category</FieldLabel>
                  <select
                    id="product-category"
                    {...field}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bespoke">Bespoke</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="metal"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                  <FieldLabel htmlFor="product-metal">Precious Metal</FieldLabel>
                  <select
                    id="product-metal"
                    {...field}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="24K Gold">24K Gold</option>
                    <option value="22K Gold">22K Gold</option>
                    <option value="18K White Gold">18K White Gold</option>
                    <option value="18K Rose Gold">18K Rose Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                  <FieldLabel htmlFor="product-price">Price (USD)</FieldLabel>
                  <input
                    id="product-price"
                    type="number"
                    min="1"
                    step="1"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="3500"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                  <FieldLabel htmlFor="product-stock">Stock Units</FieldLabel>
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="1"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="imageUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                <FieldLabel htmlFor="product-image">Image URL</FieldLabel>
                <input
                  id="product-image"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <FieldDescription>Direct link to photography of the jewellery item</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                <FieldLabel htmlFor="product-desc">Artisan Description</FieldLabel>
                <textarea
                  id="product-desc"
                  rows={3}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Handcrafted solitaire featuring VVS1 clarity diamond set in handcrafted gold prongs..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="isFeatured"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid} className="flex-col items-start">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="product-featured"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor="product-featured">Feature in Atelier Showcase</FieldLabel>
                </div>
                <FieldDescription>
                  Promotes this jewellery piece to the homepage showcase carousel
                </FieldDescription>
              </Field>
            )}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={form.formState.isSubmitting}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer"
            >
              {form.formState.isSubmitting ? 'Saving...' : isEditing ? 'Update Masterpiece' : 'Commission Piece'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

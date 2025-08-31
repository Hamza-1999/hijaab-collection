"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, ArrowLeft, Trash, Upload, X } from "lucide-react";
import { useCreateProduct } from "@/lib/hooks/api";
import { toast } from "sonner";
import { IProduct } from "@/lib/API/api";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  quantity: z.string().min(1, "Quantity is required"),
  material: z.string().min(1, "Material is required"),
  featured: z.boolean(),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  // images: z.array(z.file()).min(1, "At least one image is required"),
  images: z
    .array(z.instanceof(File)) // use z.instanceof(File) if in browser
    .min(1, "At least one image is required"),
  // live: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "a",
      quantity: "0",
      material: "",
      featured: false,
      colors: [],
      sizes: [],
      images: [],
    },
  });

  const addColor = () => {
    const colors = form.getValues("colors");
    if (newColor && !colors.includes(newColor)) {
      form.setValue("colors", [...colors, newColor]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    const colors = form.getValues("colors");
    form.setValue(
      "colors",
      colors.filter((c) => c !== color)
    );
  };

  const addSize = () => {
    const sizes = form.getValues("sizes");
    if (newSize && !sizes.includes(newSize)) {
      form.setValue("sizes", [...sizes, newSize]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    const sizes = form.getValues("sizes");
    form.setValue(
      "sizes",
      sizes.filter((s) => s !== size)
    );
  };

  // const onSubmit = (data: ProductFormValues) => {
  //   console.log("Form submitted:", data);
  //   const formdata = new FormData();
  //   data.images.forEach((file: File, i: number) => {
  //     formdata.append("images", file);
  //   });
  //   formdata.append("title", data.title);
  //   formdata.append("description", data.description);
  //   formdata.append("price", data.price);
  //   formdata.append("quantity", data.quantity);
  //   formdata.append("materail", data.material);
  //   formdata.append("featured", data.featured.toString());
  //   data.colors.forEach((col) => {
  //     formdata.append("colors", col);
  //   });
  //   formdata.append("live", "true");
  //   data.sizes.forEach((size) => {
  //     formdata.append("sizes", size);
  //   });

  //   for (const [key, value] of formdata.entries()) {
  //     console.log(key, value);
  //   }

  // createProduct(
  //   //@ts-ignore
  //   formdata,
  //   {
  //     onSuccess: () => {
  //       toast.success("Product Created Successfully");
  //     },
  //     onError: (err: any) => {
  //       toast.error(
  //         err?.response?.data?.message || "Failed To Create Product"
  //       );
  //     },
  //   }
  // );
  //   console.log(formdata)
  //   // router.push("/admin/products");
  // };
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();

      // Images
      data.images.forEach((file: File) => formData.append("images", file));

      // Primitive fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());
      formData.append("material", data.material);
      formData.append("featured", data.featured.toString());
      formData.append("live", "true");

      // Arrays as JSON
      formData.append("colors", JSON.stringify(data.colors));
      formData.append("sizes", JSON.stringify(data.sizes));

      createProduct(
        //@ts-ignore
        { formData: formData }, 
        {
          onSuccess: () => {
            toast.success("Product Created Successfully");
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed To Create Product"
            );
          },
        }
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed To Create Product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
          <p className="text-slate-600">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label htmlFor="title">Product Name</Label>
                      <Input
                        {...field}
                        id="title"
                        placeholder="Premium Silk Hijab"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        {...field}
                        id="description"
                        rows={4}
                        placeholder="Describe your product..."
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="price"
                    render={({ field, fieldState }) => (
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          {...field}
                          id="price"
                          type="number"
                          step="0.01"
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="quantity"
                    render={({ field, fieldState }) => (
                      <div>
                        <Label htmlFor="quantity">Stock Quantity</Label>
                        <Input {...field} id="quantity" type="number" />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Controller
                  control={form.control}
                  name="material"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Premium-Silk">
                            Premium Silk
                          </SelectItem>
                          <SelectItem value="Cotton-Jersey">
                            Cotton Jersey
                          </SelectItem>
                          <SelectItem value="Chiffon">Chiffon</SelectItem>
                          <SelectItem value="Modal Blend">
                            Modal Blend
                          </SelectItem>
                          <SelectItem value="Georgette">Georgette</SelectItem>
                          <SelectItem value="Bamboo-Fiber">
                            Bamboo Fiber
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  control={form.control}
                  name="images"
                  render={({ field, fieldState }) => (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <label
                        htmlFor="fileInput"
                        className="cursor-pointer px-4 py-2"
                      >
                        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 mb-2">
                          Drag and drop images here, or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                      <Input
                        className="hidden"
                        id="fileInput"
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            const allowedTypes = [
                              "image/png",
                              "image/jpeg",
                              "image/webp",
                            ];
                            const filteredFiles = filesArray.filter((file) =>
                              allowedTypes.includes(file.type)
                            );
                            field.onChange([...field.value, ...filteredFiles]);
                          }
                        }}
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                      <div className="mt-5 flex items-center gap-2 flex-wrap">
                        {field.value.map((img: File, i: number) => (
                          <div
                            key={i}
                            className="relative border-2 border-dashed border-gray-600 p-2"
                          >
                            <Image
                              src={URL.createObjectURL(img)}
                              alt={img.name}
                              width={100}
                              height={100}
                              className="w-10 h-10 object-contain"
                            />
                            <span
                              onClick={() => {
                                const newFiles = field.value.filter(
                                  (file: File) => file.name !== img.name
                                );
                                field.onChange(newFiles);
                              }}
                              className="p-2 hover:cursor-pointer text-white bg-black/80 rounded-full absolute top-2 right-2 z-10"
                            >
                              <Trash className="text-white w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured */}
            <Card>
              <CardHeader>
                <CardTitle>Product Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        name={field.name}
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                      {/* id="featured"
                      /> */}
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Available Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addColor())
                    }
                  />
                  <Button type="button" onClick={addColor} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.getValues("colors").map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"
                    >
                      <span className="text-sm">{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-slate-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.colors && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.colors.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Sizes */}
            <Card>
              <CardHeader>
                <CardTitle>Available Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add size"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSize())
                    }
                  />
                  <Button type="button" onClick={addSize} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.getValues("sizes").map((size) => (
                    <div
                      key={size}
                      className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"
                    >
                      <span className="text-sm">{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-slate-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.sizes && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.sizes.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-amber-800 hover:bg-amber-900"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Creating..."
                      : "Create Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

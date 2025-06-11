// firestoreService.ts
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  getDoc,
  where,
} from "firebase/firestore";
import { db } from "./firestore";
import { Product, Variant, Category } from "../types/types";

// Collection references
const productsCollection = collection(db, "products");
const categoriesCollection = collection(db, "categories");

// Conversion functions
const convertToProduct = (id: string, data: any): Product => {
  return {
    id,
    name: data.name || "",
    brand: data.brand || "",
    description: data.description || "",
    categoryId: data.categoryId || "",
    images: data.images || ["https://via.placeholder.com/150"],
    defaultPrice: data.defaultPrice || 0,
    variants: data.variants || [],
  };
};

const convertToCategory = (id: string, data: any): Category => {
  return {
    id,
    name: data.name || "",
    description: data.description || "",
  };
};

// Products CRUD operations
export const addProduct = async (
  product: Omit<Product, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(productsCollection, product);
    console.log("Product added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  newData: Partial<Product>
): Promise<void> => {
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, newData);
    console.log("Product updated with ID:", id);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    console.log("Product deleted with ID:", id);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(query(productsCollection));
    const products: Product[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const product = convertToProduct(docSnapshot.id, data);
      products.push(product);
    });

    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, "products", id);
    const docSnapshot = await getDoc(productRef);

    if (docSnapshot.exists()) {
      return convertToProduct(docSnapshot.id, docSnapshot.data());
    } else {
      console.log("No product found with ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
};

export const getProductsByCategory = async (
  categoryId: string
): Promise<Product[]> => {
  try {
    const q = query(productsCollection, where("categoryId", "==", categoryId));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const product = convertToProduct(docSnapshot.id, data);
      products.push(product);
    });

    return products;
  } catch (error) {
    console.error("Error getting products by category:", error);
    return [];
  }
};

// Categories CRUD operations
export const addCategory = async (
  category: Omit<Category, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(categoriesCollection, category);
    console.log("Category added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  newData: Partial<Category>
): Promise<void> => {
  try {
    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, newData);
    console.log("Category updated with ID:", id);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);
    console.log("Category deleted with ID:", id);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const querySnapshot = await getDocs(query(categoriesCollection));
    const categories: Category[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const category = convertToCategory(docSnapshot.id, data);
      categories.push(category);
    });

    return categories;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const categoryRef = doc(db, "categories", id);
    const docSnapshot = await getDoc(categoryRef);

    if (docSnapshot.exists()) {
      return convertToCategory(docSnapshot.id, docSnapshot.data());
    } else {
      console.log("No category found with ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Error getting category:", error);
    return null;
  }
};

// Helper function to add a variant to a product
export const addVariantToProduct = async (
  productId: string,
  variant: Variant
): Promise<void> => {
  try {
    const product = await getProductById(productId);
    if (!product) throw new Error("Product not found");

    const variants = product.variants || [];
    variants.push(variant);

    await updateProduct(productId, { variants });
  } catch (error) {
    console.error("Error adding variant to product:", error);
    throw error;
  }
};

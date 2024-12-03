"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Category {
  id: string;
  name: string;
}

interface ProductEditFormProps {
  productId: string;
  initialData: {
    title: string;
    color: string;
    size: string;
    price: number;
    description: string;
    categoryIds: string[];
  };
}

const ProductEditForm = ({ productId, initialData }: ProductEditFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      console.error("ID de l'utilisateur manquant");
      alert("Erreur: ID de l'utilisateur non trouvé");
      return;
    }

    try {
      const response = await fetch(`/api/product/${productId}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          influencerId: session.user.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la modification du produit");
      }

      router.refresh();
      router.push("/boutique/products");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Titre
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full rounded-md border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Couleur
        </label>
        <input
          type="text"
          value={formData.color}
          onChange={(e) => setFormData({...formData, color: e.target.value})}
          className="w-full rounded-md border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Taille
        </label>
        <input
          type="text"
          value={formData.size}
          onChange={(e) => setFormData({...formData, size: e.target.value})}
          className="w-full rounded-md border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Prix
        </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
          className="w-full rounded-md border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full rounded-md border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Catégorie
        </label>
        <select
          value={formData.categoryIds[0] || ""}
          onChange={(e) => setFormData({...formData, categoryIds: [e.target.value]})}
          className="w-full rounded-md border p-2"
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-influenca-black p-2 text-white hover:opacity-80"
      >
        Modifier le produit
      </button>
    </form>
  );
};

export default ProductEditForm;
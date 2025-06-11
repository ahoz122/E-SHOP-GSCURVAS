import React, { useState, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import AdminNavbar from './AdminNavbar';
import Card from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Category } from '../../types/types';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../firebase/firestoreService';

// Separate Category Modal component
interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category;
    setCategory: React.Dispatch<React.SetStateAction<Category>>;
    isEditMode: boolean;
    onSave: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    category,
    setCategory,
    isEditMode,
    onSave
}) => {
    return (
        <Modal
            header={isEditMode ? "Editar Categoría" : "Nueva Categoría"}
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={true}
            footer={
                <div className="flex justify-end w-full gap-2 px-4">
                    <Button 
                        label="Cancelar" 
                        icon="pi pi-times" 
                        onClick={onClose} 
                        className="p-button-text" 
                    />
                    <Button 
                        label="Guardar" 
                        icon="pi pi-check" 
                        onClick={onSave} 
                        autoFocus 
                        className="bg-blue-500 hover:bg-blue-600 border-none"
                    />
                </div>
            }
            modalConfig={{
                width: "50%",
                bodyPadding: "lg",
                bodyAlignment: "left",
            }}
        >
            <div className="field mb-4">
                <label htmlFor="name" className="font-medium mb-2 block">Nombre</label>
                <InputText 
                    id="name" 
                    value={category.name} 
                    onChange={(e) => setCategory({...category, name: e.target.value})} 
                    required 
                    className="w-full"
                />
            </div>
            <div className="field">
                <label htmlFor="description" className="font-medium mb-2 block">Descripción</label>
                <InputTextarea 
                    id="description" 
                    value={category.description || ''} 
                    onChange={(e) => setCategory({...category, description: e.target.value})} 
                    rows={3} 
                    className="w-full"
                />
            </div>
        </Modal>
    );
};

const AdminCategories: React.FC = (): JSX.Element => {
        const [categories, setCategories] = useState<Category[]>([]);
        const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
        const [searchTerm, setSearchTerm] = useState('');
        const [isLoading, setIsLoading] = useState(true);
        const [isSearchFocused, setIsSearchFocused] = useState(false);
        const [displayDialog, setDisplayDialog] = useState(false);
        const [isEditMode, setIsEditMode] = useState(false);
        const [category, setCategory] = useState<Category>({
                id: '',
                name: '',
                description: ''
        });
        const toast = React.useRef<Toast>(null);

        const fetchCategories = async () => {
                setIsLoading(true);
                try {
                        const fetchedCategories = await getCategories();
                        setCategories(fetchedCategories);
                        setFilteredCategories(fetchedCategories);
                } catch (error) {
                        console.error("Error loading categories:", error);
                } finally {
                        setIsLoading(false);
                }
        };

        useEffect(() => {
                const loadingTimer = setTimeout(() => {
                        fetchCategories();
                }, 800);
                return () => clearTimeout(loadingTimer);
        }, []);

        useEffect(() => {
                if (searchTerm.trim() === '') {
                        setFilteredCategories(categories);
                } else {
                        const lowercaseSearch = searchTerm.toLowerCase();
                        const filtered = categories.filter(
                                (cat) =>
                                        cat.name.toLowerCase().includes(lowercaseSearch) ||
                                        cat.description?.toLowerCase().includes(lowercaseSearch)
                        );
                        setFilteredCategories(filtered);
                }
        }, [searchTerm, categories]);

        const openNew = () => {
                setCategory({ id: '', name: '', description: '' });
                setIsEditMode(false);
                setDisplayDialog(true);
        };

        const editCategory = (cat: Category) => {
                setCategory({...cat});
                setIsEditMode(true);
                setDisplayDialog(true);
        };

        const confirmDeleteCategory = (cat: Category) => {
                confirmDialog({
                        message: `¿Estás seguro que deseas eliminar la categoría "${cat.name}"?`,
                        header: 'Confirmar Eliminación',
                        icon: 'pi pi-exclamation-triangle',
                        acceptClassName: 'p-button-danger',
                        accept: () => handleDeleteCategory(cat)
                });
        };

        const handleDeleteCategory = async (cat: Category) => {
                try {
                        await deleteCategory(cat.id);
                        setCategories(categories.filter(c => c.id !== cat.id));
                        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría eliminada' });
                } catch (error) {
                        console.error("Error deleting category:", error);
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la categoría' });
                }
        };

        const saveCategory = async () => {
                if (!category.name.trim()) {
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'El nombre de la categoría es obligatorio' });
                        return;
                }

                try {
                        if (isEditMode) {
                                await updateCategory(category.id, category);
                                const updatedCategories = categories.map((c) => c.id === category.id ? category : c);
                                setCategories(updatedCategories);
                                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada' });
                        } else {
                                const newId = await addCategory({...category});
                                const newCategory = { ...category, id: newId };
                                setCategories([...categories, newCategory]);
                                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría agregada' });
                        }
                        setDisplayDialog(false);
                } catch (error) {
                        console.error("Error saving category:", error);
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la categoría' });
                }
        };

        const containerVariants = {
                hidden: { opacity: 0 },
                visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                },
        };

        const itemVariants = {
                hidden: { y: 20, opacity: 0 },
                visible: {
                        y: 0,
                        opacity: 1,
                        transition: { type: "spring", stiffness: 300, damping: 24 },
                },
                exit: { y: -10, opacity: 0, transition: { duration: 0.2 } }
        };

        const fabButtonVariants = {
                hidden: { scale: 0, opacity: 0 },
                visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { type: "spring", stiffness: 400, damping: 15, delay: 0.5 }
                },
                tap: { scale: 0.9 },
                hover: {
                        scale: 1.1,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }
        };

        const CategoryCard = ({ cat }: { cat: Category }) => (
                <Card className="transition-all duration-300 hover:shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-lg text-gray-800">{cat.name}</h3>
                                <div className="flex gap-2">
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-sm" onClick={() => editCategory(cat)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-sm" onClick={() => confirmDeleteCategory(cat)} />
                                </div>
                        </div>
                        {cat.description && <p className="text-gray-600 text-sm">{cat.description}</p>}
                </Card>
        );

        return (
                <>
                        <Toast ref={toast} />
                        <ConfirmDialog />
                        
                        {!isLoading && <AdminNavbar />}

                        <div className="p-3 min-h-screen bg-gray-50">
                                <AnimatePresence mode="wait">
                                        {isLoading ? (
                                                <motion.div
                                                        key="loading-screen"
                                                        className="fixed inset-0 flex items-center justify-center bg-white z-50"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                                                >
                                                        <div className="text-center px-4">
                                                                <motion.div
                                                                        className="flex justify-center mb-6"
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                                                                >
                                                                        <div className="relative">
                                                                                <motion.div
                                                                                        className="w-20 h-20 rounded-full border-4 border-blue-100"
                                                                                        initial={{ opacity: 0 }}
                                                                                        animate={{ opacity: 1 }}
                                                                                >
                                                                                        <motion.div
                                                                                                className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500"
                                                                                                animate={{
                                                                                                        rotate: 360,
                                                                                                        transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
                                                                                                }}
                                                                                        ></motion.div>
                                                                                </motion.div>
                                                                                <motion.div
                                                                                        className="absolute inset-0 flex items-center justify-center text-blue-500"
                                                                                        initial={{ scale: 0 }}
                                                                                        animate={{ scale: 1, transition: { delay: 0.3, type: "spring", stiffness: 200 } }}
                                                                                >
                                                                                        <i className="pi pi-tag text-xl"></i>
                                                                                </motion.div>
                                                                        </div>
                                                                </motion.div>
                                                                <motion.h2
                                                                        className="text-xl font-medium text-gray-800 mb-2"
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                                                                >
                                                                        Cargando categorías
                                                                </motion.h2>
                                                        </div>
                                                </motion.div>
                                        ) : (
                                                <div className="max-w-5xl mx-auto p-2">
                                                        <motion.div
                                                                className="mb-4"
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.2, duration: 0.3 }}
                                                        >
                                                                <motion.div
                                                                        className={`flex items-center px-3 py-2 bg-white rounded-lg ${
                                                                                isSearchFocused ? "shadow-md" : "shadow-sm"
                                                                        }`}
                                                                        animate={{
                                                                                boxShadow: isSearchFocused
                                                                                        ? "0 4px 8px -2px rgba(0, 0, 0, 0.06)"
                                                                                        : "0 1px 2px rgba(0, 0, 0, 0.05)",
                                                                        }}
                                                                        transition={{ duration: 0.2 }}
                                                                >
                                                                        <i className={`pi pi-search px-2 mr-2 ${isSearchFocused || searchTerm ? "text-blue-500" : "text-gray-400"}`}></i>
                                                                        <input
                                                                                type="text"
                                                                                value={searchTerm}
                                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                                placeholder="Buscar categorías..."
                                                                                className="custom-search-input w-full bg-transparent text-gray-700"
                                                                                onFocus={() => setIsSearchFocused(true)}
                                                                                onBlur={() => setIsSearchFocused(false)}
                                                                        />
                                                                </motion.div>
                                                        </motion.div>

                                                        <motion.div
                                                                key="content"
                                                                variants={containerVariants}
                                                                initial="hidden"
                                                                animate="visible"
                                                        >
                                                                <AnimatePresence>
                                                                        {filteredCategories.length > 0 ? (
                                                                                <motion.div
                                                                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                                                                        layout
                                                                                >
                                                                                        {filteredCategories.map((cat) => (
                                                                                                <motion.div
                                                                                                        key={cat.id}
                                                                                                        variants={itemVariants}
                                                                                                        initial="hidden"
                                                                                                        animate="visible"
                                                                                                        exit="exit"
                                                                                                        layout
                                                                                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                                                                                >
                                                                                                        <CategoryCard cat={cat} />
                                                                                                </motion.div>
                                                                                        ))}
                                                                                </motion.div>
                                                                        ) : (
                                                                                <motion.div
                                                                                        className="col-span-full py-16 text-center text-gray-500 bg-white rounded-lg shadow-sm"
                                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                                        animate={{ opacity: 1, scale: 1, transition: { type: "spring", damping: 20, stiffness: 100, delay: 0.3 } }}
                                                                                >
                                                                                        <i className="pi pi-tag text-5xl text-gray-300 mb-4"></i>
                                                                                        <h3 className="text-xl font-medium mb-2">
                                                                                                {searchTerm ? "No se encontraron categorías" : "No hay categorías"}
                                                                                        </h3>
                                                                                        <p className="text-gray-400 mb-6">
                                                                                                {searchTerm ? "Intenta con otra búsqueda" : "Crea una categoría para empezar"}
                                                                                        </p>
                                                                                        {!searchTerm && (
                                                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                                                        <Button
                                                                                                                label="Crear Categoría"
                                                                                                                icon="pi pi-plus"
                                                                                                                onClick={openNew}
                                                                                                                className="bg-blue-500 hover:bg-blue-600 border-none"
                                                                                                        />
                                                                                                </motion.div>
                                                                                        )}
                                                                                </motion.div>
                                                                        )}
                                                                </AnimatePresence>
                                                        </motion.div>
                                                </div>
                                        )}
                                </AnimatePresence>

                                {/* Floating button to add category */}
                                <AnimatePresence>
                                        {!isLoading && filteredCategories.length > 0 && (
                                                <motion.div
                                                        className="fixed bottom-6 right-6 z-10"
                                                        variants={fabButtonVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        whileTap="tap"
                                                        whileHover="hover"
                                                        exit={{ scale: 0, opacity: 0 }}
                                                >
                                                        <Button
                                                                icon="pi pi-plus"
                                                                className="p-button-rounded shadow-lg bg-blue-500 hover:bg-blue-600 border-none"
                                                                onClick={openNew}
                                                                style={{ width: "3.5rem", height: "3.5rem" }}
                                                        />
                                                </motion.div>
                                        )}
                                </AnimatePresence>

                                {/* Category Modal Component */}
                                <CategoryModal
                                        isOpen={displayDialog}
                                        onClose={() => setDisplayDialog(false)}
                                        category={category}
                                        setCategory={setCategory}
                                        isEditMode={isEditMode}
                                        onSave={saveCategory}
                                />
                        </div>
                </>
        );
};

export default AdminCategories;
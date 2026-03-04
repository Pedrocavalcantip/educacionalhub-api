import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

interface Resource {
  id: number;
  title: string;
  type: string;
  url: string;
  description: string;
  tags: string;
}

interface FormData {
  title: string;
  type: string;
  url: string;
  description: string;
  tags: string;
}

export default function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: 'Vídeo',
    url: '',
    description: '',
    tags: ''
  });

  const fetchResources = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/resources/');
      if (!response.ok) throw new Error("Erro ao buscar dados");
      
      const data = await response.json();
      setResources(data.reverse()); 
    } catch (error) {
      console.error("Erro na listagem:", error);
    }
  };

  // Roda apenas uma vez quando a página carrega
  useEffect(() => {
    fetchResources();
  }, []);

  const handleEditClick = (resource: Resource) => {
    setEditingId(resource.id);
    setFormData({
      title: resource.title,
      type: resource.type,
      url: resource.url,
      description: resource.description,
      // Se as tags vierem como array do banco, transformamos em string para o input
      tags: Array.isArray(resource.tags) ? resource.tags.join(', ') : resource.tags
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', type: 'Vídeo', url: '', description: '', tags: '' });
    setPdfFile(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      // Define a URL como o nome do arquivo temporariamente
      setFormData({ ...formData, url: file.name });
    } else {
      alert('Por favor, selecione um arquivo PDF válido!');
      e.target.value = '';
    }
  };

  const handleSmartAssist = async () => {
    if (!formData.title) return alert("Preencha o título primeiro!");
    
    setLoadingAI(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/resources/smart-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type
        })
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
      }

      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        description: data.description,
        tags: data.tags.join(', ') 
      }));

    } catch (error) {
      console.error("Erro ao gerar descrição:", error);
      alert("Erro ao conectar com a IA. Verifique se o backend está rodando!");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let finalUrl = formData.url;

    // Se for PDF, fazer upload primeiro
    if (formData.type === 'PDF' && pdfFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', pdfFile);

        const uploadResponse = await fetch('http://127.0.0.1:8000/resources/upload-pdf', {
          method: 'POST',
          body: uploadFormData
        });

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload do PDF');
        }

        const uploadData = await uploadResponse.json();
        // Converte o caminho do arquivo para URL completa
        finalUrl = `http://127.0.0.1:8000/${uploadData.file_path.replace(/\\/g, '/')}`;
        
      } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao fazer upload do PDF. Verifique se o backend está rodando!');
        return;
      }
    }
    
    // Converte tags de string para array
    const tagsArray = formData.tags 
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    try {
      const urlBase = 'http://127.0.0.1:8000/resources/';
      const urlFinal = editingId ? `${urlBase}${editingId}` : urlBase;
      const method = editingId ? 'PUT' : 'POST';

      const dbResponse = await fetch(urlFinal, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          url: finalUrl,
          description: formData.description,
          tags: tagsArray
        })
      });

      if (!dbResponse.ok) throw new Error('Erro ao processar requisição no banco.');

      const savedResource = await dbResponse.json();

      if (editingId) {
        setResources(prev => prev.map(res => res.id === editingId ? savedResource : res));
        alert("Recurso atualizado com sucesso!");
      } else {
        setResources(prev => [savedResource, ...prev]);
        alert("Recurso adicionado com sucesso!");
      }

      handleCancelEdit(); 

    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro na comunicação com o banco de dados.');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este recurso?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir o recurso no servidor.");
      }

      setResources(prevResources => prevResources.filter(res => res.id !== id));
      
      alert("Recurso excluído com sucesso!");
      
    } catch (error) {
      console.error("Erro na exclusão:", error);
      alert("Não foi possível excluir o recurso.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-black p-8 font-sans selection:bg-pink-300">
      
      <header className="mb-12">
        <h1 className="text-4xl font-black border-4 border-black p-4 inline-block bg-[#FDE047] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          Gerenciamento de Recursos Educacionais 
        </h1>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit">
          <h2 className="text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2">Novo Recurso</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-bold block mb-1">Título</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleInputChange}
                className="w-full border-4 border-black p-3 focus:outline-none focus:bg-yellow-50 font-medium"
                placeholder="Ex: Introdução à Álgebra Linear" required
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Tipo</label>
              <select name="type" value={formData.type} onChange={handleInputChange}
                className="w-full border-4 border-black p-3 focus:outline-none focus:bg-yellow-50 font-bold">
                <option value="Vídeo">Vídeo</option>
                <option value="PDF">PDF</option>
                <option value="Link">Link</option>
              </select>
            </div>

            {formData.type === 'PDF' ? (
              <div>
                <label className="font-bold block mb-1">Upload de PDF</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="file" 
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="w-full border-4 border-black p-3 focus:outline-none focus:bg-yellow-50 font-medium file:mr-4 file:py-2 file:px-4 file:border-0 file:font-bold file:bg-pink-100 file:text-black hover:file:bg-pink-200 file:cursor-pointer"
                    required
                  />
                </div>
                {pdfFile && (
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="font-bold block mb-1">URL / Link</label>
                <input 
                  type="url" name="url" value={formData.url} onChange={handleInputChange}
                  className="w-full border-4 border-black p-3 focus:outline-none focus:bg-yellow-50 font-medium"
                  placeholder="https://..." required
                />
              </div>
            )}

            <div className="mt-2 mb-2">
              <button 
                type="button" 
                onClick={handleSmartAssist}
                disabled={loadingAI}
                className="w-full bg-[#F472B6] hover:bg-[#db2777] text-white border-4 border-black p-3 font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingAI ? 'Pensando...' : ' Gerar Descrição com IA'}
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1">Descrição</label>
              <textarea 
                name="description" value={formData.description} onChange={handleInputChange} rows={4}
                className="w-full border-4 border-black p-3 focus:outline-none focus:bg-yellow-50 font-medium resize-none"
              ></textarea>
            </div>

            <div>
              <label className="font-bold block mb-1">Tags (separadas por vírgula)</label>
              <input 
                type="text" name="tags" value={formData.tags} onChange={handleInputChange}
                className="w-full border-4 border-black p-3 focus:outline-none focus:bg-yellow-50 font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button type="submit" className="mt-4 bg-[#60A5FA] hover:bg-[#3b82f6] text-black border-4 border-black p-4 font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all">
                {editingId ? 'Atualizar Recurso' : 'Salvar Recurso'}
              </button>

              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="bg-gray-400 hover:bg-gray-500 text-black border-4 border-black p-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="col-span-2 flex flex-col gap-6">
          {resources.map((res) => (
            <div key={res.id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-black leading-tight">{res.title}</h3>
                  <span className="bg-[#FDE047] border-4 border-black px-3 py-1 font-black text-sm uppercase">
                    {res.type}
                  </span>
                </div>
                
                <p className="text-gray-800 font-medium mb-4">{res.description}</p>
                <a href={res.url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline mb-4 inline-block">Acessar Link </a>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {(Array.isArray(res.tags) ? res.tags : res.tags.split(',')).map((tag, idx) => (
                    <span key={idx} className="bg-gray-200 border-2 border-black px-2 py-1 text-xs font-bold uppercase">
                      {typeof tag === 'string' ? tag.trim() : tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-6 border-t-4 border-black pt-4">
                <button 
                  onClick={() => handleEditClick(res)} 
                  className="flex-1 bg-white border-4 border-black p-2 font-bold uppercase hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all">
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(res.id)} 
                  className="flex-1 bg-red-500 text-white border-4 border-black p-2 font-bold uppercase hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all">
                  Excluir
                </button>
              </div>

            </div>
          ))}
        </section>

      </main>
    </div>
  );
}
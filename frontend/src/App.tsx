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
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: 'Vídeo',
    url: '',
    description: '',
    tags: ''
  });

  // apenas para simular uma lista 
  useEffect(() => {
    setResources([
      {
        id: 1,
        title: 'Introdução à Álgebra Linear',
        type: 'Vídeo',
        url: 'https://youtube.com/...',
        description: 'Este vídeo oferece uma introdução clara e concisa aos conceitos da álgebra linear e espaços euclidianos.',
        tags: 'Matemática, Álgebra, Espaços'
      }
    ]);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSmartAssist = async () => {
    if (!formData.title) return alert("Preencha o título primeiro!");
    
    setLoadingAI(true);
    
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        description: 'Descrição gerada brilhantemente pela IA baseada no seu título!',
        tags: 'Tag1, Tag2, Tag3'
      }));
      setLoadingAI(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Salvar no banco:", formData);
    //futuro: enviar para backend e atualizar lista de recursos
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-black p-8 font-sans selection:bg-pink-300">
      
      <header className="mb-12">
        <h1 className="text-4xl font-black border-4 border-black p-4 inline-block bg-[#FDE047] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          EducacionalHub 
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
                placeholder="Ex: Padrões de Projeto em Python" required
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

            <div>
              <label className="font-bold block mb-1">URL / Link</label>
              <input 
                type="url" name="url" value={formData.url} onChange={handleInputChange}
                className="w-full border-4 border-black p-3 focus:outline-none focus:bg-yellow-50 font-medium"
                placeholder="https://..." required
              />
            </div>

            <div className="mt-2 mb-2">
              <button 
                type="button" 
                onClick={handleSmartAssist}
                disabled={loadingAI}
                className="w-full bg-[#F472B6] hover:bg-[#db2777] text-white border-4 border-black p-3 font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingAI ? '⏳ A IA está pensando...' : ' Gerar Descrição com IA'}
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

            <button type="submit" className="mt-4 bg-[#60A5FA] hover:bg-[#3b82f6] text-black border-4 border-black p-4 font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all">
              Salvar Recurso
            </button>
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
                <a href={res.url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline mb-4 inline-block">Acessar Link ↗</a>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {res.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="bg-gray-200 border-2 border-black px-2 py-1 text-xs font-bold uppercase">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-6 border-t-4 border-black pt-4">
                <button className="flex-1 bg-white border-4 border-black p-2 font-bold uppercase hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all">
                  Editar
                </button>
                <button className="flex-1 bg-red-500 text-white border-4 border-black p-2 font-bold uppercase hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none transition-all">
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
import { useState } from 'react'
import Image from 'next/image'

type ProfileImageUploadProps = {
    currentAvatar?: string
    currentBanner?: string
    onSave: (avatar: File | null, banner: File | null) => Promise<void>
}

export default function ProfileImageUpload({ currentAvatar, currentBanner, onSave }: ProfileImageUploadProps) {
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setBannerFile(file)
            setBannerPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSave(avatarFile, bannerFile)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Photo de profil
                </label>
                <div className="flex items-center gap-4">
                    <div className="size-24 overflow-hidden rounded-full">
                        {(avatarPreview || currentAvatar) && (
                            <Image
                                src={avatarPreview || `${currentAvatar}`}
                                alt="Avatar preview"
                                width={96}
                                height={96}
                                className="size-full object-cover"
                                unoptimized
                            />
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="flex-1"
                    />
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Image de bannière
                </label>
                <div className="space-y-2">
                    <div className="h-32 w-full overflow-hidden rounded-lg">
                        {(bannerPreview || currentBanner) && (
                            <Image
                                src={bannerPreview || `${currentBanner}`}
                                alt="Banner preview"
                                width={400}
                                height={128}
                                className="size-full object-cover"
                                unoptimized
                            />
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="w-full"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-black p-3 text-white hover:opacity-80"
            >
                Enregistrer les modifications
            </button>
        </form>
    )
} 
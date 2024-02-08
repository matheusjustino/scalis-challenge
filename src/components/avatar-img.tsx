import Image from 'next/image';

interface AvatarImgProps {
    firstName?: string;
    lastName?: string;
}

const AvatarImg: React.FC<AvatarImgProps> = ({
    firstName = 'John',
    lastName = 'Doe',
}) => {
    return (
        <Image
            src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&color=3730a3&bold=true`}
            alt="Avatar picture"
            className="!relative rounded-md"
            fill
            priority
            quality={80}
        />
    );
};

export { AvatarImg };
